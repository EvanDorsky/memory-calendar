const server = Bun.serve({
  port: 3000,
  fetch(req) {
    return new Response(Bun.file("." + new URL(req.url).pathname));
  },
});

console.log(`http://localhost:${server.port}`);
