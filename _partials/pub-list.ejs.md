<%
// Publications list. Same markup as Quarto's default listing (so category
// filtering, pagination and listings.css keep working), plus each paper's
// `links:` (Publication / Preprint / Code / Website) as buttons.
// Note: in Quarto's EJS the equals tag outputs raw HTML and the dash tag escapes.
%>
::: {.list .quarto-listing-default}

<% for (const item of items) { %>

::: {.quarto-post .image-left <%= metadataAttrs(item) %>}

::: {.body}

<h3 class="no-anchor listing-title"><a href="<%- item.path %>" class="no-external"><%= item.title %></a></h3>

<% if (item.categories) { %>

```{=html}
<div class="listing-categories">
<% for (const category of item.categories) { %>
<div class="listing-category" onclick="window.quartoListingCategory('<%= utils.b64encode(category) %>'); return false;"><%= category %></div>
<% } %>
</div>
```

<% } %>

<% if (item.description) { %>

```{=html}
<div class="delink listing-description"><a href="<%- item.path %>" class="no-external">
```

<%= item.description %>

```{=html}
</a></div>
```

<% } %>

<% if (Array.isArray(item.links) && item.links.length) { %>

```{=html}
<div class="zl-pub-links">
<% for (const l of item.links) { if (!l || !l.url) continue; %>
<a href="<%- l.url %>" target="_blank" rel="noopener"><% if (l.icon) { %><i class="bi bi-<%- l.icon %>"></i><% } %><%= l.name || "Link" %></a>
<% } %>
</div>
```

<% } %>

:::

::: {.metadata}

```{=html}
<a href="<%- item.path %>" class="no-external">
```

<% if (item.date) { %>
<div class="listing-date"><%= item.date %></div>
<% } %>

<% if (item.author) { %>
<div class="listing-author"><%= item.author %></div>
<% } %>

```{=html}
</a>
```

:::

:::

<% } %>

:::
