# gitHub-caller #

## 中文

如果我们想在自己的网站使用github api,需要在获得code之后,通过github.com/login/oauth/access_token获取token.但是这个接口无法跨域使用.
而相较于gatekeeper,如果使用github pages搭建网站,则不得不将token明文保存在前端.项目因此有了这个项目.github-caller是一个帮助获取github token的工具.他可以加密token保存在前端.

## Api
### /authenticate/:code/:state
- method get
它提供了一个 /authenticate/:code/:state 接口,可以传入在https://github.com/login/oauth/authorize 重定向后获得的state和code;然后返回token和token经过加密后得到的authkey.这里token只做使用,不应该将保存到前端任何地方.只应该保存authkey

### /login
- method post
- request body params: {code, state, authkey}
该项目通过crypto 进行非对称加密.加密token.可以实现前端不保存token,只保存加密数据,state和code,然后通过 /login 接口 传入 code, authkey(加密数据数据), state 进行解密,返回token

## English

If we want to use github api on our website, we need to obtain the token through github.com/login/oauth/access_token after obtaining the code. However, this interface cannot be used across domains.
Compared with gatekeeper, if you use github pages to build a website, you have to save the token in plain text on the front end. Therefore, the project has this project. github-caller is a tool to help obtain github token. It can encrypt the token and save it on the front end.

## API
### /authenticate/:code/:state
- method get
It provides an /authenticate/:code/:state interface, which can pass in the state and code obtained after the redirection of https://github.com/login/oauth/authorize; and then returns the token and the encrypted token. authkey. The token here is only for use and should not be saved anywhere on the front end. Only the authkey should be saved.

### /login
- method post
- request body params: {code, state, authkey}
This project uses crypto to perform asymmetric encryption and encrypt the token. It can be realized that the front end does not save the token, but only saves the encrypted data, state and code, and then passes in the code, authkey (encrypted data), and state through the /login interface to decrypt and return the token.
