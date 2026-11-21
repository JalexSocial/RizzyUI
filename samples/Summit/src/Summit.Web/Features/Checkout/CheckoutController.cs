using Microsoft.AspNetCore.Mvc;
using Rizzy;
using Rizzy.Framework.Mvc;
using Rizzy.Htmx;
using RizzyUI.Services.RzToast;
using Summit.Web.Features.Tickets;
using Summit.Web.Infrastructure;

namespace Summit.Web.Features.Checkout;

/// <summary>
/// The four-step checkout. Each step is an htmx form: a 422 returns the same step with its errors and
/// the typed values; success returns the next step, updates the step indicator and the order summary out
/// of band, and pushes the step's URL, so Back and Forward move between steps.
/// </summary>
public sealed class CheckoutController(CheckoutService checkout, IHtmxSwapService swaps, IRzToastService toasts, TimeProvider clock) : RzController
{
    // Entry point from the tickets page: /tickets/checkout?ticket=conference.
    [HttpGet("/tickets/checkout")]
    public async Task<IResult> Start(string? ticket)
    {
        var visitorId = HttpContext.GetOrCreateVisitorId();
        var data = await checkout.LoadAsync(visitorId);
        if (ticket is not null && ticket != data.Ticket)
        {
            data.Ticket = ticket;
            data.Reached = CheckoutStep.Tickets;
            await checkout.SaveAsync(visitorId, data);
        }
        // Reached by a plain link as well as by boosted navigation (SF-043).
        Response.HtmxIfRequested(h => h.PushUrl("/tickets/checkout/tickets"));
        return View<CheckoutPage>(new { View = await BuildAsync(CheckoutStep.Tickets, data) });
    }

    [HttpGet("/tickets/checkout/{step}")]
    public async Task<IResult> Show(string step)
    {
        if (!CheckoutSteps.TryParse(step, out var current))
            return Results.NotFound();

        var data = await checkout.LoadAsync(HttpContext.GetOrCreateVisitorId());
        // A later step needs the earlier ones: send the visitor to the first incomplete step.
        if (current > data.Reached)
            return Results.Redirect($"/tickets/checkout/{data.Reached.Slug()}");

        return View<CheckoutPage>(new { View = await BuildAsync(current, data) });
    }

    [HttpPost("/tickets/checkout/tickets"), ValidateAntiForgeryToken]
    public async Task<IResult> Tickets([FromForm(Name = "Model")] TicketsStepModel model)
    {
        var visitorId = HttpContext.GetOrCreateVisitorId();
        var data = await checkout.LoadAsync(visitorId);

        if (ModelState.IsValid && await checkout.AvailabilityProblemAsync(model.Ticket, model.Quantity) is { } problem)
            ModelState.AddModelError("Model.Ticket", problem);
        if (model.AddOns.Any(a => CheckoutCatalog.AddOns.All(x => x.Id != a)))
            ModelState.AddModelError("Model.AddOns", "Choose add-ons from the list.");

        if (!ModelState.IsValid)
            return await InvalidAsync<TicketsStep>(CheckoutStep.Tickets, data);

        data.Ticket = model.Ticket;
        data.Quantity = model.Quantity;
        data.AddOns = model.AddOns.Distinct().ToList();
        // One attendee entry per ticket; keep what was already typed.
        while (data.Attendees.Count < data.Quantity) data.Attendees.Add(new AttendeeInput());
        data.Attendees = data.Attendees.Take(data.Quantity).ToList();
        data.Reached = Max(data.Reached, CheckoutStep.Attendees);
        await checkout.SaveAsync(visitorId, data);

        return await NextAsync<AttendeesStep>(CheckoutStep.Attendees, data);
    }

    [HttpPost("/tickets/checkout/attendees"), ValidateAntiForgeryToken]
    public async Task<IResult> Attendees([FromForm(Name = "Model")] AttendeesStepModel model)
    {
        var visitorId = HttpContext.GetOrCreateVisitorId();
        var data = await checkout.LoadAsync(visitorId);
        var view = await BuildAsync(CheckoutStep.Attendees, data);

        for (var i = 0; i < model.Attendees.Count; i++)
        {
            var attendee = model.Attendees[i];
            if (view.Quote.Ticket?.IncludesWorkshop == true)
            {
                if (attendee.WorkshopSessionId is null)
                    ModelState.AddModelError($"Model.Attendees[{i}].WorkshopSessionId", "Choose a workshop for this ticket.");
                else if (view.WorkshopSeatsLeft(attendee.WorkshopSessionId.Value) < model.Attendees.Count(a => a.WorkshopSessionId == attendee.WorkshopSessionId))
                    ModelState.AddModelError($"Model.Attendees[{i}].WorkshopSessionId", "Not enough seats left in that workshop. Choose another one.");
            }
            if (attendee.Email is not null && model.Attendees.Take(i).Any(a => string.Equals(a.Email, attendee.Email, StringComparison.OrdinalIgnoreCase)))
                ModelState.AddModelError($"Model.Attendees[{i}].Email", "Each ticket needs its own email address.");
        }
        if (model.Attendees.Count != data.Quantity)
            ModelState.AddModelError(string.Empty, "The number of attendees does not match the number of tickets. Go back to the tickets step.");

        if (!ModelState.IsValid)
            return await InvalidAsync<AttendeesStep>(CheckoutStep.Attendees, data);

        data.Attendees = model.Attendees;
        data.Reached = Max(data.Reached, CheckoutStep.Payment);
        await checkout.SaveAsync(visitorId, data);
        return await NextAsync<PaymentStep>(CheckoutStep.Payment, data);
    }

    [HttpPost("/tickets/checkout/discount"), ValidateAntiForgeryToken]
    public async Task<IResult> Discount([FromForm(Name = "Discount")] DiscountModel model)
    {
        var visitorId = HttpContext.GetOrCreateVisitorId();
        var data = await checkout.LoadAsync(visitorId);

        if (ModelState.IsValid)
        {
            var (_, error) = await checkout.CheckDiscountAsync(model.Code);
            if (error is not null) ModelState.AddModelError("Discount.Code", error);
        }

        if (!ModelState.IsValid)
        {
            Response.Htmx().ValidationFailed();
            return PartialView<DiscountField>(new { Applied = (string?)null });
        }

        data.DiscountCode = model.Code!.Trim().ToUpperInvariant();
        await checkout.SaveAsync(visitorId, data);
        var quote = await checkout.QuoteAsync(data);
        swaps.AddSwappableComponent<OrderSummary>("order-summary", new { Quote = quote });
        toasts.Success($"{quote.DiscountPercent}% off your order.", "Discount applied");
        return PartialView<DiscountField>(new { Applied = data.DiscountCode, Percent = quote.DiscountPercent });
    }

    [HttpPost("/tickets/checkout/payment"), ValidateAntiForgeryToken]
    public async Task<IResult> Payment([FromForm(Name = "Model")] PaymentStepModel model)
    {
        var visitorId = HttpContext.GetOrCreateVisitorId();
        var data = await checkout.LoadAsync(visitorId);
        if (data.Reached < CheckoutStep.Payment)
            ModelState.AddModelError(string.Empty, "Complete the earlier steps first.");
        if (model.PaymentMethod is not ("invoice" or "demo"))
            ModelState.AddModelError("Model.PaymentMethod", "Choose how you want to pay.");

        if (ModelState.IsValid)
        {
            var (order, error) = await checkout.PlaceOrderAsync(visitorId, data, model);
            if (order is not null)
            {
                // Replace the whole checkout (steps, form and summary) with the confirmation.
                Response.Htmx(h => h.Retarget("#checkout").Reswap(SwapStyle.outerHTML).PushUrl($"/tickets/confirmation/{order.Number}"));
                toasts.Success($"Order {order.Number} is confirmed. Your tickets are on their way to {order.BuyerEmail}.", "You're going to Summit!");
                var placed = await checkout.FindOrderAsync(order.Number, visitorId);
                return PartialView<CheckoutConfirmation>(new { Order = placed, JustPlaced = true });
            }

            // Sold out (or sales closed) since the tickets step.
            ModelState.AddModelError(string.Empty, error!);
        }

        return await InvalidAsync<PaymentStep>(CheckoutStep.Payment, data);
    }

    [HttpGet("/tickets/confirmation/{number}")]
    public async Task<IResult> Confirmation(string number)
    {
        var order = await checkout.FindOrderAsync(number, HttpContext.GetVisitorId());
        return order is null ? Results.NotFound() : View<ConfirmationPage>(new { Order = order });
    }

    private async Task<IResult> NextAsync<TStep>(CheckoutStep step, CheckoutData data) where TStep : Microsoft.AspNetCore.Components.IComponent
    {
        var view = await BuildAsync(step, data);
        swaps.AddSwappableComponent<CheckoutStepIndicator>("checkout-steps", new { Current = step });
        swaps.AddSwappableComponent<OrderSummary>("order-summary", new { Quote = view.Quote });
        Response.Htmx(h => h.PushUrl($"/tickets/checkout/{step.Slug()}"));
        return PartialView<TStep>(new { View = view, Fresh = true });
    }

    private async Task<IResult> InvalidAsync<TStep>(CheckoutStep step, CheckoutData data) where TStep : Microsoft.AspNetCore.Components.IComponent
    {
        Response.Htmx().ValidationFailed();
        var formError = ModelState.TryGetValue(string.Empty, out var entry) ? entry.Errors.FirstOrDefault()?.ErrorMessage : null;
        return PartialView<TStep>(new { View = await BuildAsync(step, data), FormError = formError });
    }

    private async Task<CheckoutView> BuildAsync(CheckoutStep step, CheckoutData data)
    {
        var sold = await checkout.SoldAsync();
        var now = clock.GetUtcNow();
        var offers = (await checkout.TicketTypesAsync()).Select(t => new TicketOffer(t, sold.GetValueOrDefault(t.Id), now)).ToList();
        return new CheckoutView(step, data, await checkout.QuoteAsync(data), offers, await checkout.WorkshopsAsync(), await checkout.WorkshopSeatsTakenAsync());
    }

    private static CheckoutStep Max(CheckoutStep a, CheckoutStep b) => a > b ? a : b;
}

/// <summary>Everything a checkout step renders.</summary>
public sealed record CheckoutView(
    CheckoutStep Step, CheckoutData Data, CheckoutQuote Quote, IReadOnlyList<TicketOffer> Offers,
    IReadOnlyList<Data.Entities.Session> Workshops, IReadOnlyDictionary<int, int> WorkshopTaken)
{
    public int WorkshopSeatsLeft(int sessionId)
    {
        var workshop = Workshops.SingleOrDefault(w => w.Id == sessionId);
        return workshop is null ? 0 : workshop.Capacity - WorkshopTaken.GetValueOrDefault(sessionId);
    }
}
