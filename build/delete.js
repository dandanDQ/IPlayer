let exec_ = require('child_process').exec;

const sleep = async (seconds) => {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
};
const exec = async (command) => {
  const res = await new Promise((resolve, reject) => {
    exec_(command, (err, stdout, stderr) => {
      console.error(err);
      console.log(stdout);
      console.error(stderr);
      if (err) reject(err);

      resolve({ stdout, stderr });
    });
  });
  return res;
};

const main = async () => {
  for (let i = 6; i <= 6; i += 1) {
    const version = `2.0.${i}`;
    await exec(`npm unpublish vue-iplayer@${version} --force`);
    console.log(`npm unpublish vue-iplayer@${version} --force`);
    await sleep(3);
  }
};

main();
