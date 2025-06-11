document.getElementById('ajaxForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  const name = formData.get('name');

  const response = await fetch('/remove-cookie-ajax', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ name })
  });

  const result = await response.json();
  document.getElementById('response').innerText = result.message;
});
