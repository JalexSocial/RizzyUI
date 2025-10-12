using System.Linq.Expressions;

namespace RizzyUI.TailwindVariants;

internal record struct CompiledVariant<TOwner, TSlots>(Expression<VariantAccessor<TOwner>> Expr, IVariant<TSlots> Entry, VariantAccessor<TOwner> Accessor)
    where TSlots : ISlots, new()
    where TOwner : ISlotted<TSlots>;