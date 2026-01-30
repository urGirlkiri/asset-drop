export default defineBackground(() => {
  browser.sidePanel && browser.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
});
