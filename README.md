# JWT SSO 单点登录

### 注意
server-center 运行在http://localhost:3000上；server-app1 运行在http://127.0.0.1:3001上。这样不会同享cookie，形成跨域。

### 流程

#### 未登录流程

1. app1(client) --跳转-->认证中心(client)
2. 认证中心(client) --登录--> 认证中心(server).
  a. 认证中心创建会话session
  b. 认证中心创建accees token 和 refresh token并返回
3. 认证中心(server) --http response--> 认证中心(client)
4. 认证中心(client) --url携带access token 和refresh token跳转-->app1(client).将refresh token 和access token存于localstorage
5. app1(client) --> 携带access token--http request--> app1(server)
6. app1(server) --验证access token的有效性--有效--http response--> app1(client)

#### access token 失效流程

1. app1(client) --携带access token--http request-->app1(server) 验证access token有效性
2. app1(server) -- access token 无效--http response(403)-->app1(client)
3. app1(client) -- 跳转--> 认证中心(client)
4. 认证中心(client) --携带已登录的cookie--http request--> 认证中心(server).会话存在，则生成access token和refresh token
5. 认证中心(server) -- 携带access token 和refresh token--http request-->认证中心(client)
6. 认证中心(client) --url携带access token 和refresh token跳转-->app1(client).将refresh token 和access token存于localstorage
7. app1(client) --> 携带access token--http request--> app1(server)
8. app1(server) --验证access token的有效性--有效--http response--> app1(client)

注意： 这里其实还有个access token 失效，去通过refresh token 获取access token的过程