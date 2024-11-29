const OPENAI_API_HOST = "api.deepseek.com";

console.log('hello');

Deno.serve(async (request) => {
  const url = new URL(request.url);
  url.host = OPENAI_API_HOST;

  const reader = request.body.getReader();
  let value = new Uint8Array();
  while (true) {
    const { done, value: chunk } = await reader.read();
    if (done) break;
    const temp = new Uint8Array(value.length + chunk.length);
    temp.set(value, 0);
    temp.set(chunk, value.length);
    value = temp;
  }
  console.log(new TextDecoder().decode(value));

  const newRequest = new Request(url.toString(), {
    headers: request.headers,
    method: request.method,
    body: value,
    redirect: "follow",
  });
  return await fetch(newRequest);
});
