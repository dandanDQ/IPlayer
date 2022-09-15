
const path = require('path');
const fs = require('fs');
let exec_ = require('child_process').exec

const readFile = async (path) => {
  const res = await new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if(err) reject(err);
      resolve(data)
    })
  })
  return res
}

const writeFile = async (path, content) => {
  const res = await new Promise((resolve, reject) => {
    fs.writeFile(path, content, (err) => {
      if(err) reject(err)
      resolve()
    })
  })
  return res
}

const exec = async (command) => {
  const res = await new Promise((resolve, reject) => {
    exec_(command, (err, stdout, stderr) => {
      console.error(err)
      console.log(stdout)
      console.error(stderr)
      if(err) reject(err)

      resolve({stdout, stderr})
    })
  })
  return res
}


const main = async () => {

  // 1、修改版本号
  // 自动增加小版本。也可以手动填写版本号。
  // 会进行版本校验，遵循 semver 规范：主版本号：不兼容的 API 修改；次版本号：向下兼容的新功能；修订号：向下兼容的问题修正

  // 参数可以填写 version=1.0.4， 也可以不填
  const args = process.argv.slice(2)
  const processedArgs = {};

  args.forEach(str => {
    if (!str.includes('=')) return;
    const [name, value] = str.split('=');
    processedArgs[name] = value;
  });

  // 用户填写的版本号
  let version = processedArgs.version
  // 读取 package.json
  const pkgPath = path.resolve(__dirname, '../package.json')
  const data = await readFile(pkgPath)
  const pkg = JSON.parse(data.toString())

  // 计算新的版本号
  if(!version) {
    const versionList = pkg.version.split('.').map(str => Number(str))
    versionList[versionList.length - 1] += 1 // 修订号 +1
    version = versionList.join('.')
  }

  pkg.version = version

  // 写入 package.json 
  writeFile(pkgPath, JSON.stringify(pkg, null, 2))

  // 2. git 添加代码
  await exec(`git add .`)
  await exec(`git commit -m "feat: release version ${version}"`)
  await exec(`git push`)

  // 3. 构建 & 发布
  await exec(`npm run build`)
  await exec(`npm publish`)
}

main()