﻿using Blazicons;
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Represents a breadcrumb navigation component that displays a list of navigation links.
/// </summary>
public partial class Breadcrumb : RizzyComponent
{
    /// <summary>
    /// Base CSS classes for the breadcrumb component.
    /// </summary>
    private static readonly string BaseStyle = "text-sm font-medium text-on-primary  mb-4";

    /// <summary>
    /// Gets the list of breadcrumb items registered with this breadcrumb component.
    /// </summary>
    private readonly List<BreadcrumbItem> Items = new();

    /// <summary>
    /// Specifies the type of separator to use between breadcrumb items.
    /// </summary>
    [Parameter]
    public SvgIcon Separator { get; set; } = MdiIcon.ChevronRight;

    /// <summary>
    /// Child content for the breadcrumb component, typically <see cref="BreadcrumbItem"/> components.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, BaseStyle);
    }

    /// <summary>
    /// Registers a breadcrumb item with this breadcrumb component.
    /// </summary>
    /// <param name="item">The breadcrumb item to register.</param>
    internal void RegisterItem(BreadcrumbItem item)
    {
        Items.Add(item);
        InvokeAsync(StateHasChanged);
    }
}
