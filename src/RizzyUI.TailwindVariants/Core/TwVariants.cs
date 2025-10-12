using System.Diagnostics;
using System.Linq.Expressions;
using System.Text;
using static RizzyUI.TailwindVariants.TvHelpers;
using Tw = TailwindMerge.TwMerge;

namespace RizzyUI.TailwindVariants;

/// <summary>
/// Core function factory that builds a Tailwind-variants-like function.
/// </summary>
public class TwVariants(Tw merge)
{
    /// <summary>
    /// Creates a slot map containing the final computed CSS class strings for each slot, based on the provided owner and options.
    /// </summary>
    /// <typeparam name="TOwner">The type that owns the slots and variants.</typeparam>
    /// <typeparam name="TSlots">The type representing the slots, which must implement <see cref="ISlots"/>.</typeparam>
    /// <param name="owner">The instance providing slot and variant values.</param>
    /// <param name="definition">The configuration options for base slots, variants, and compound variants.</param>
    /// <returns>
    /// A <see cref="SlotsMap{TSlots}"/> mapping slot names to their final computed CSS class strings.
    /// </returns>
    /// <remarks>
    /// The returned function is safe to call multiple times; per-call overrides do not mutate precomputed definitions.
    /// </remarks>
    public SlotsMap<TSlots> Invoke<TOwner, TSlots>(TOwner owner, TvDescriptor<TOwner, TSlots> definition)
        where TSlots : ISlots, new()
        where TOwner : ISlotted<TSlots>
    {
        // 1. Start with base slots
        var builders = definition.BaseSlots.ToDictionary(
            kv => kv.Key,
            kv => new StringBuilder(kv.Value));

        // 2. Apply variants
        builders = ApplyVariants(owner, builders, definition.BaseVariants);

        // 3. Apply compound variants
        builders = ApplyCompoundVariants(definition, owner, builders);

        // 4. Apply per-instance slot overrides (Classes property)
        if (owner.Classes is not null)
        {
            foreach (var (slot, value) in owner.Classes.EnumerateOverrides())
            {
                if (!builders.TryGetValue(slot, out var builder))
                {
                    builder = new StringBuilder();
                    builders[slot] = builder;
                }
                builder.Append(' ');
                builder.Append(value);
            }
        }

        // 5. Build final map
        return builders.ToDictionary(
            kv => kv.Key,
            kv => merge.Merge(kv.Value.ToString()));
    }

    #region Helpers

    private static void AddSlotClass<TSlots>(
        Dictionary<string, StringBuilder> builders,
        Expression<SlotAccessor<TSlots>> accessor,
        string classes) where TSlots : ISlots, new()
    {
        var name = GetSlot(accessor);
        if (!builders.TryGetValue(name, out var builder))
        {
            builder = new StringBuilder();
            builders[name] = builder;
        }
        builder.Append(' ');
        builder.Append(classes);
    }

    private static Dictionary<string, StringBuilder> ApplyCompoundVariants<TOwner, TSlots>(
        TvDescriptor<TOwner, TSlots>? options,
        TOwner owner,
        Dictionary<string, StringBuilder> builders)
        where TSlots : ISlots, new()
        where TOwner : ISlotted<TSlots>
    {
        if (options?.CompoundVariants is null)
        {
            return builders;
        }

        foreach (var cv in options.CompoundVariants)
        {
            try
            {
                if (!cv.Predicate(owner))
                {
                    continue;
                }

                if (!string.IsNullOrEmpty(cv.Class))
                {
                    AddSlotClass<TSlots>(builders, s => s.Base, cv.Class);
                }

                foreach (var pairs in cv)
                {
                    var slot = pairs.Key;

                    if (slot is null)
                    {
                        continue;
                    }

                    AddSlotClass(builders, slot, pairs.Value.ToString());
                }
            }
            catch (Exception ex)
            {
                // keep robust but log for debugging
                Debug.WriteLine($"Compound variant predicate or processing failed: {ex.Message}");
            }
        }

        return builders;
    }

    private static Dictionary<string, StringBuilder> ApplyVariants<TOwner, TSlots>(
        TOwner owner,
        Dictionary<string, StringBuilder> builders,
        IReadOnlyDictionary<string, CompiledVariant<TOwner, TSlots>> baseVariants)
        where TSlots : ISlots, new()
        where TOwner : ISlotted<TSlots>
    {
        foreach (var compiled in baseVariants.Values)
        {
            try
            {
                var selected = compiled.Accessor(owner);
                if (selected is null) continue;

                if (compiled.Entry.TryGetSlots(selected, out var slots) && slots is not null)
                {
                    foreach (var kv in slots)
                    {
                        AddSlotClass(builders, kv.Key, kv.Value.ToString());
                    }
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Variant evaluation failed for '{compiled.Expr}': {ex.Message}");
            }
        }

        if (!string.IsNullOrEmpty(owner.Class))
        {
            AddSlotClass<TSlots>(builders, s => s.Base, owner.Class);
        }

        return builders;
    }

    #endregion Helpers
}