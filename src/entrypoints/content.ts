export default defineContentScript({
  matches: ['*://*.itch.io/*'],
  main() {
    console.log('Hello content.');
  },
});
