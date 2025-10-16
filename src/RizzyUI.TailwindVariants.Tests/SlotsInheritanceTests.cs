   using System.Linq;
    using RizzyUI.TailwindVariants.Tests.Components.Base;
    using Microsoft.AspNetCore.Components;
    using RizzyUI.TailwindVariants;
    using Shouldly;

    namespace RizzyUI.TailwindVariants.Tests;

    #region Test Models

    // A base component with a virtual Slots class
    public partial class BaseComponent : TwComponentBase, ISlotted<BaseComponent.Slots>
    {
        public Slots? Classes { get; set; }

        public partial class Slots : ISlots
        {
            public virtual string? Base { get; set; }
            public virtual string? Icon { get; set; }
        }
    }

    // A derived component with a Slots class that inherits from the base
    public partial class DerivedComponent : TwComponentBase, ISlotted<DerivedComponent.Slots>
    {
        public Slots? Classes { get; set; }

        public partial class Slots : BaseComponent.Slots
        {
            [Slot("label-custom")]
            public override string? Icon { get; set; } // Override a base property
            public string? Label { get; set; } // Add a new property
        }
    }

    // A component with a sealed slots class
    public partial class SealedComponent : TwComponentBase, ISlotted<SealedComponent.Slots>
    {
        public Slots? Classes { get; set; }

        public sealed partial class Slots : ISlots
        {
            public string? Base { get; set; }
        }
    }


    #endregion

    public class SlotsInheritanceTests : TestContext
    {
        public SlotsInheritanceTests()
        {
            Services.AddTailwindVariants();
        }

        /// <summary>
        /// Verifies that the source generator correctly generates `override` for `EnumerateOverrides`
        /// in a derived `Slots` class and correctly chains the base method call.
        /// </summary>
        [Fact]
        public void EnumerateOverrides_OnDerivedClass_IncludesBaseAndDerivedProperties()
        {
            // Arrange
            var derivedSlots = new DerivedComponent.Slots
            {
                Base = "base-class",   // From BaseComponent.Slots
                Icon = "icon-class",   // Overridden from BaseComponent.Slots
                Label = "label-class"  // From DerivedComponent.Slots
            };

            // Act
            var overrides = derivedSlots.EnumerateOverrides().ToDictionary(t => t.Slot, t => t.Value);

            // Assert
            overrides.ShouldNotBeNull();
            overrides.Count.ShouldBe(3);

            // Check that properties from both base and derived classes are present.
            // Also verifies that the [Slot] attribute was correctly applied to the overridden property.
            overrides["Base"].ShouldBe("base-class");
            overrides["label-custom"].ShouldBe("icon-class"); // Note the custom name from [Slot]
            overrides["Label"].ShouldBe("label-class");
        }

        /// <summary>
        /// This test confirms that the `GetName` static method on a derived class correctly resolves
        /// property names to slot names for properties declared in both the base and derived classes.
        /// It also confirms the `[Slot]` attribute is respected on overridden properties.
        /// </summary>
        [Fact]
        public void GetName_OnDerivedClass_ResolvesAllPropertiesInHierarchy()
        {
            // Assert
            // Property from base class
            DerivedComponent.Slots.GetName(nameof(DerivedComponent.Slots.Base)).ShouldBe("Base");
            // Property overridden in derived class with a [Slot] attribute
            DerivedComponent.Slots.GetName(nameof(DerivedComponent.Slots.Icon)).ShouldBe("label-custom");
            // Property new in derived class
            DerivedComponent.Slots.GetName(nameof(DerivedComponent.Slots.Label)).ShouldBe("Label");
        }

        /// <summary>
        /// This integration test ensures that when Tv.Invoke is called with a derived `Slots` class
        /// that has `Classes` overrides, all overrides from the entire inheritance chain are correctly applied.
        /// </summary>
        [Fact]
        public void Invoke_WithDerivedClassOverrides_AppliesAllOverrides()
        {
            // Arrange
            var tv = Services.GetRequiredService<TwVariants>();
            var descriptor = new TvDescriptor<DerivedComponent, DerivedComponent.Slots>(
                @base: "base-default",
                slots: new()
                {
                    [s => s.Icon] = "icon-default",
                    [s => s.Label] = "label-default"
                }
            );

            var component = new DerivedComponent
            {
                Classes = new DerivedComponent.Slots
                {
                    Base = "base-override",
                    Icon = "icon-override",
                    Label = "label-override"
                }
            };

            // Act
            var result = tv.Invoke(component, descriptor);

            // Assert
            result.GetBase().ShouldBe("base-default base-override");
            // Note: The accessor `s => s.Icon` correctly maps to the "label-custom" slot via GetName.
            result[s => s.Icon].ShouldBe("icon-default icon-override");
            result.GetLabel().ShouldBe("label-default label-override");
        }

        /// <summary>
        /// This test inspects the generated code via reflection to confirm that the `EnumerateOverrides`
        /// method has the correct `virtual` or `override` modifier based on its position in the hierarchy.
        /// </summary>
        [Fact]
        public void GeneratedMethods_HaveCorrect_VirtualAndOverride_Modifiers()
        {
            // Arrange
            var baseMethod = typeof(BaseComponent.Slots).GetMethod("EnumerateOverrides");
            var derivedMethod = typeof(DerivedComponent.Slots).GetMethod("EnumerateOverrides");
            var sealedMethod = typeof(SealedComponent.Slots).GetMethod("EnumerateOverrides");

            // Assert
            baseMethod.ShouldNotBeNull();
            baseMethod.IsVirtual.ShouldBeTrue();
            baseMethod.IsFinal.ShouldBeFalse(); // It should be virtual, not sealed override

            derivedMethod.ShouldNotBeNull();
            derivedMethod.GetBaseDefinition().ShouldNotBe(derivedMethod); // This confirms it's an override
            
            sealedMethod.ShouldNotBeNull();
            sealedMethod.IsVirtual.ShouldBeFalse(); // On a sealed class, it should be a non-virtual public method
        }

        /// <summary>
        /// Verifies that SlotNames.AllPairs exposes (Property, Slot) for every slot in declaration order,
        /// and that [Slot("...")] renames are reflected (Icon -> "label-custom").
        /// </summary>
        [Fact]
        public void SlotNames_AllPairs_IncludesRenamedEntries_And_PreservesOrder()
        {
            // Act
            var pairs = DerivedComponent.SlotNames.AllPairs.ToList();

            // Assert: contents
            pairs.ShouldContain(p => p.Property == nameof(DerivedComponent.Slots.Base)  && p.Slot == "Base");
            pairs.ShouldContain(p => p.Property == nameof(DerivedComponent.Slots.Icon)  && p.Slot == "label-custom"); // renamed via [Slot("label-custom")]
            pairs.ShouldContain(p => p.Property == nameof(DerivedComponent.Slots.Label) && p.Slot == "Label");

            // Assert: order matches declaration order across the inheritance chain
            pairs.Select(p => p.Property).ToArray().ShouldBe(new[]
            {
                nameof(DerivedComponent.Slots.Base),   // from BaseComponent.Slots
                nameof(DerivedComponent.Slots.Icon),   // declared in base, overridden in derived
                nameof(DerivedComponent.Slots.Label)   // declared in derived
            });
        }
    }