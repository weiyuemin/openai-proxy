const OPENAI_API_HOST = "api.deepseek.com";

console.log('hello');

Deno.serve(async (request) => {
  const url = new URL(request.url);
  url.host = OPENAI_API_HOST;

  const reader = request.body.getReader();
  const { value } = await reader.read();
  console.log(new TextDecoder().decode(value));

  const newBody = new ReadableStream({
    start(controller) {
      controller.enqueue(value);
      controller.close();
    },
  });

  const newRequest = new Request(url.toString(), {
    headers: request.headers,
    method: request.method,
    body: newBody,
    redirect: "follow",
  });
  return await fetch(newRequest);
});
