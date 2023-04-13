declare module "*.scss" {
    const classes: { readonly [key: string]: string };
    export default classes;
}
declare module "*.svg";
declare module "*.png";
declare module "*.frag" {
    export default string;
}
declare module "*.vert" {
    export default string;
}
declare module "react-syntax-highlighter/dist/esm/styles/prism";
declare module "react-syntax-highlighter";
