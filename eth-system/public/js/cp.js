function cp() {
  new ClipboardJS('#cp', {
    text: function (trigger) {
      return trigger.getAttribute('data-clipboard-text');
    },
  });
}
