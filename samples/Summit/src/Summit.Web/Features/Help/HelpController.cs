using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Rizzy.Framework.Mvc;
using Rizzy.Htmx;
using RizzyUI.Services.RzToast;
using Summit.Web.Data;
using Summit.Web.Data.Entities;

namespace Summit.Web.Features.Help;

public sealed class HelpController(SummitDbContext db, IRzToastService toasts, TimeProvider clock) : RzController
{
    private const long MaxAttachmentBytes = 2 * 1024 * 1024;
    private static readonly string[] AllowedExtensions = [".png", ".jpg", ".jpeg", ".pdf"];

    [HttpGet("/help")]
    public async Task<IResult> Index()
    {
        var faqs = await db.Faqs.AsNoTracking().OrderBy(f => f.SortOrder).ToListAsync();
        var settings = await db.Settings.AsNoTracking().SingleAsync();
        return View<HelpPage>(new { Faqs = faqs, SupportEmail = settings.SupportEmail });
    }

    // Posted with htmx as multipart/form-data. Invalid input (including the attachment) returns 422 with
    // the form, its errors and the typed values; a browser cannot refill a file input, so the error says
    // to choose the file again.
    [HttpPost("/help/contact"), ValidateAntiForgeryToken]
    [RequestSizeLimit(5 * 1024 * 1024)]
    public async Task<IResult> Contact([FromForm(Name = "Model")] ContactModel model, [FromForm(Name = "Model.Attachment")] IFormFile? attachment)
    {
        if (model.Topic is not null && !ContactModel.Topics.Contains(model.Topic))
            ModelState.AddModelError("Model.Topic", "Choose a topic from the list.");

        if (attachment is { Length: > 0 })
        {
            var extension = Path.GetExtension(attachment.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(extension))
                ModelState.AddModelError("Model.Attachment", "Attach a PNG, JPG or PDF file. Choose the file again after fixing this.");
            else if (attachment.Length > MaxAttachmentBytes)
                ModelState.AddModelError("Model.Attachment", $"The file is {attachment.Length / 1024 / 1024.0:0.0} MB; the limit is 2 MB. Choose a smaller file.");
        }

        if (!ModelState.IsValid)
        {
            Response.Htmx().ValidationFailed();
            return PartialView<ContactForm>();
        }

        db.SupportRequests.Add(new SupportRequest
        {
            Name = model.Name!, Email = model.Email!, Topic = model.Topic!, Message = model.Message!,
            AttachmentName = attachment?.FileName, AttachmentSize = attachment?.Length,
            ReceivedAt = clock.GetUtcNow(),
        });
        await db.SaveChangesAsync();

        toasts.Success("We usually answer within one working day.", "Message sent");
        return PartialView<ContactForm>(new { Sent = true, SentTo = model.Email });
    }
}
