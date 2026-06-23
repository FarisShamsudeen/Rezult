import app from './server/src/app';
app._router.stack.forEach((r: any) => {
  if (r.route && r.route.path) {
    console.log(r.route.path);
  } else if (r.name === 'router') {
    console.log(r.regexp);
  }
});
