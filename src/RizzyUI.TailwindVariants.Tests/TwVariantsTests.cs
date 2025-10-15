
using System.Linq;
    using Tw = TailwindMerge.TwMerge;

    namespace RizzyUI.TailwindVariants.Tests;

    #pragma warning disable CS0436 // Type conflicts with imported type

    #region Test Models

    public partial class ButtonComponent : ISlotted<ButtonComponent.ButtonSlots>
    {
        public string? Class { get; set; }
        public ButtonSlots? Classes { get; set; }
        public bool IsDisabled { get; set; }
        public bool IsLoading { get; set; }
        public string? Size { get; set; }
        public string? Variant { get; set; }

        public sealed partial class ButtonSlots : ISlots
        {
            [Slot("root")]
            public string? Base { get; set; }
            public string? Icon { get; set; }
            public string? Label { get; set; }
        }
    }

    public partial class TestComponent : ISlotted<TestComponent.TestSlots>
    {
        public string? Class { get; set; }
        public TestSlots? Classes { get; set; }
        public string? Color { get; set; }
        public bool IsDisabled { get; set; }
        public string? Size { get; set; }

        public sealed partial class TestSlots : ISlots
        {
            public string? Base { get; set; }
            public string? Container { get; set; }
            [Slot("descr")]
            public string? Description { get; set; }
            public string? Title { get; set; }
        }
    }

    // --- New Models for Inheritance/Extends Tests ---

    public partial class BaseCard : ISlotted<BaseCard.BaseCardSlots>
    {
        public string? Class { get; set; }
        public BaseCardSlots? Classes { get; set; }
        public bool Compact { get; set; }

        public partial class BaseCardSlots : ISlots
        {
            public virtual string? Base { get; set; }
            public virtual string? Body { get; set; }
        }
    }

    public partial class ImageCard : ISlotted<ImageCard.ImageCardSlots>
    {
        public string? Class { get; set; }
        public ImageCardSlots? Classes { get; set; }
        public bool Compact { get; set; } // Inherited variant property
        public bool HasImage { get; set; } // New variant property

        // Inherits from BaseCardSlots to add a new slot
        public sealed partial class ImageCardSlots : BaseCard.BaseCardSlots
        {
            public string? Image { get; set; }
        }
    }

    // --- New Models for Multi-level Inheritance Tests ---

    public partial class GrandParentCard : ISlotted<GrandParentCard.Slots>
    {
        public GrandParentCard.Slots? Classes { get; set; }
        public string? Class { get; set; }

        public partial class Slots : ISlots
        {
            public virtual string? GrandParentSlot { get; set; }
            public virtual string? Base { get; set; }
        }
    }

    public partial class ParentCard : ISlotted<ParentCard.Slots>
    {
        public ParentCard.Slots? Classes { get; set; }
        public string? Class { get; set; }

        public partial class Slots : GrandParentCard.Slots
        {
            public virtual string? ParentSlot { get; set; }
        }
    }

    public partial class ChildCard : ISlotted<ChildCard.Slots>
    {
        public ChildCard.Slots? Classes { get; set; }
        public string? Class { get; set; }

        public sealed partial class Slots : ParentCard.Slots
        {
            public string? ChildSlot { get; set; }
        }
    }


    #endregion Test Models

    public class TwVariantsTests
    {
        private readonly TwVariants _tv;

        public TwVariantsTests()
        {
            _tv = new TwVariants(new Tw());
        }

        #region Standard Tests

        [Fact]
        public void Invoke_AccessingNonInitializedSlot_ReturnsNull()
        {
            var descriptor = new TvDescriptor<TestComponent, TestComponent.TestSlots>(@base: "container");
            var component = new TestComponent();
            var result = _tv.Invoke(component, descriptor);
            Assert.Equal("container", result[s => s.Base]);
            Assert.Null(result[s => s.Container]);
        }

        [Fact]
        public void Invoke_GetName_ReturnsCorrectSlot()
        {
            var descriptor = new TvDescriptor<TestComponent, TestComponent.TestSlots>();
            var component = new TestComponent();
            var result = _tv.Invoke(component, descriptor);
            Assert.Equal("descr", result.GetName(TestComponent.SlotsTypes.Description));
        }

        [Fact]
        public void Invoke_WithMultipleVariants_CombinesClasses()
        {
            var descriptor = new TvDescriptor<TestComponent, TestComponent.TestSlots>(
                @base: "btn",
                variants: new()
                {
                    [c => c.Size] = new Variant<string, TestComponent.TestSlots>
                    {
                        ["lg"] = "text-lg py-3"
                    },
                    [c => c.Color] = new Variant<string, TestComponent.TestSlots>
                    {
                        ["primary"] = "bg-blue-500"
                    }
                }
            );
            var component = new TestComponent { Size = "lg", Color = "primary" };
            var result = _tv.Invoke(component, descriptor);
            var baseClasses = result[s => s.Base];
            Assert.Contains("btn text-lg py-3 bg-blue-500", baseClasses);
        }

        #endregion

        #region Extends and Inheritance Tests

        // Define base and extended descriptors for reuse in tests
        private static readonly TvDescriptor<BaseCard, BaseCard.BaseCardSlots> _baseCardDescriptor = new(
            @base: "rounded-lg shadow",
            slots: new()
            {
                [s => s.Body] = "p-4"
            },
            variants: new()
            {
                [c => c.Compact] = new Variant<bool, BaseCard.BaseCardSlots>
                {
                    [true] = new() { [s => s.Body] = "p-2" }
                }
            }
        );

        private static readonly TvDescriptor<ImageCard, ImageCard.ImageCardSlots> _imageCardDescriptor = new(
            extends: _baseCardDescriptor,
            slots: new()
            {
                [s => s.Base] = "overflow-hidden", // Appends to base descriptor's base
                [s => s.Image] = "w-full h-32 object-cover" // New slot
            },
            variants: new()
            {
                // Overrides the 'Compact' variant for the 'Body' slot
                [c => c.Compact] = new Variant<bool, ImageCard.ImageCardSlots>
                {
                    [true] = new() { [s => s.Body] = "p-1" }
                },
                // Adds a new variant
                [c => c.HasImage] = new Variant<bool, ImageCard.ImageCardSlots>
                {
                    [false] = new() { [s => s.Image] = "hidden" }
                }
            }
        );

        [Fact]
        public void Extends_CorrectlyInheritsAndAppendsBaseClasses()
        {
            var component = new ImageCard();
            var result = _tv.Invoke(component, _imageCardDescriptor);

            var @base = result.GetBase();

            // Should contain "rounded-lg shadow" from base and "overflow-hidden" from child
            Assert.Equal("rounded-lg shadow overflow-hidden", @base);
        }

        [Fact]
        public void Extends_CorrectlyInheritsBaseSlots()
        {
            var component = new ImageCard();
            var result = _tv.Invoke(component, _imageCardDescriptor);

            // Should contain "p-4" from the base descriptor's 'Body' slot
            Assert.Equal("p-4", result[s => s.Body]);
        }

        [Fact]
        public void Extends_ChildVariantOverridesParentVariant()
        {
            // When Compact is true, the child's 'p-1' should be used, not the parent's 'p-2'.
            var component = new ImageCard { Compact = true };
            var result = _tv.Invoke(component, _imageCardDescriptor);

            Assert.Equal("p-1", result[s => s.Body]);
        }

        [Fact]

        public void Extends_ParentVariantIsUsedWhenNotOverridden()
        {
            // A different descriptor that doesn't override the 'Compact' variant
            var simpleImageCard = new TvDescriptor<ImageCard, ImageCard.ImageCardSlots>(extends: _baseCardDescriptor);

            var component = new ImageCard { Compact = true };
            var result = _tv.Invoke(component, simpleImageCard);

            // The parent's 'p-2' should be applied
            Assert.Equal("p-2", result[s => s.Body]);
        }

        [Fact]
        public void Extends_ChildCanAddNewVariants()
        {
            var component = new ImageCard { HasImage = false };
            var result = _tv.Invoke(component, _imageCardDescriptor);

            // The new 'HasImage' variant should be applied
            Assert.Equal("w-full h-32 object-cover hidden", result[s => s.Image]);
        }

        [Fact]
        public void EnumerateOverrides_HandlesInheritedSlots()
        {
            // Arrange
            var slots = new ImageCard.ImageCardSlots
            {
                Base = "base-override", // Property from BaseCardSlots
                Image = "image-override" // Property from ImageCardSlots
            };

            // Act
            var overrides = slots.EnumerateOverrides().ToList();

            // Assert
            Assert.Contains((ImageCard.ImageCardSlots.GetName(nameof(slots.Base)), "base-override"), overrides);
            Assert.Contains((ImageCard.ImageCardSlots.GetName(nameof(slots.Image)), "image-override"), overrides);
            Assert.Equal(2, overrides.Count);
        }

        [Fact]
        public void EnumerateOverrides_HandlesMultiLevelInheritedSlots()
        {
            // Arrange
            var slots = new ChildCard.Slots
            {
                GrandParentSlot = "gp-override",
                ParentSlot = "p-override",
                ChildSlot = "c-override"
            };

            // Act
            var overrides = slots.EnumerateOverrides().ToList();

            // Assert
            Assert.Contains((ChildCard.Slots.GetName(nameof(slots.GrandParentSlot)), "gp-override"), overrides);
            Assert.Contains((ChildCard.Slots.GetName(nameof(slots.ParentSlot)), "p-override"), overrides);
            Assert.Contains((ChildCard.Slots.GetName(nameof(slots.ChildSlot)), "c-override"), overrides);
            Assert.Equal(3, overrides.Count);
        }

        #endregion
    }