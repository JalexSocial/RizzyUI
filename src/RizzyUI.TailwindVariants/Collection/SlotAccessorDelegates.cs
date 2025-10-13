namespace RizzyUI.TailwindVariants;

/// <summary>
/// A delegate that returns a slot's classes from a typed slots object.
/// </summary>
public delegate string? SlotAccessor<in TSlots>(TSlots slots)
    where TSlots : ISlots, new();

/// <summary>
/// Variant accessor that given an owner returns an object (selected variant).
/// </summary>
public delegate object? VariantAccessor<in TOwner>(TOwner owner);