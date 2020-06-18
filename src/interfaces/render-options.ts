/**
 * The RenderOptions are the set of options available to the render method.
 * */
export interface RenderOptions {
    // Determines whether or not the templates passed into the render method should
    // override any previously set templates when naming conflicts occur.
    prioritizeRenderTemplates?: boolean;
}
