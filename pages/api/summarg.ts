// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

const post = `
Docker简介
什么是Docker
Docker使用Google公司推出的Go语言进行开发实现，基于 Linux 内核的cgroup ,   namespace以及AUFS类的Union FS等技术，对进程进行封装隔离，属于 操作系统层面的虚拟化技术。由于隔离的进程独立于宿主和其它的隔离的进程，因此也称其为容器。最初实现是基于 LXC，从 0.7 版本以后开始去除 LXC，转而使用自行开发的libcontainer，从 1.11 开始，则进一步演进为使用 runC和containerd。
为什么要用 Docker
更高效的利用系统资源
更快速的启动时间
一致的运行环境
持续交付和部署
更轻松的迁移
更轻松的维护和扩展
基本概念
镜像
Docker 镜像（Image），就相当于是一个root文件系统。
💡
Docker 镜像是一个特殊的文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。镜像不包含任何动态数据，其内容在构建之后也不会被改变。
特点: 分层存储
容器
镜像（Image）和容器（Container）的关系，就像是面向对象程序设计中的类和实例一样，镜像是静态的定义，容器是镜像运行时的实体。
容器的实质是进程，但与直接在宿主执行的进程不同，容器进程运行于属于自己的独立的 命名空间。
💡
按照 Docker 最佳实践的要求，容器不应该向其存储层内写入任何数据，容器存储层要保持无状态化。所有的文件写入操作，都应该使用 数据卷（Volume）
、或者绑定宿主目录，在这些位置的读写会跳过容器存储层，直接对宿主（或网络存储）发生读写，其性能和稳定性更高
仓库
Docker Registry
一个 Docker Registry 中可以包含多个仓库（Repository）；每个仓库可以包含多个 标签（Tag）；每个标签对应一个镜像。
Docker Registry 公开服务
私有 Docker Registry
使用镜像
获取镜像
1.从 Docker 镜像仓库获取镜像的命令是 docker pull。其命令格式为
docker pull [选项] [Docker Registry 地址[:端口号]/]仓库名[:标签]
BashCopy
运行
docker run 就是运行容器的命令，具体格式我们会在 容器 一节进行详细讲解，我们这里简要的说明一下上面用到的参数。
it：这是两个参数，一个是 i：交互式操作，一个是 t 终端。我们这里打算进入 bash 执行一些命令并查看返回结果，因此我们需要交互式终端。
-rm：这个参数是说容器退出后随之将其删除。默认情况下，为了排障需求，退出的容器并不会立即删除，除非手动 docker rm。我们这里只是随便执行个命令，看看结果，不需要排障和保留结果，因此使用 -rm 可以避免浪费空间。
ubuntu:18.04：这是指用 ubuntu:18.04 镜像为基础来启动容器。
bash：放在镜像名后的是 命令，这里我们希望有个交互式 Shell，因此用的是 bash。
列出镜像
使用docker image ls命令
列表包含了 仓库名、标签、镜像 ID、创建时间以及所占用的空间。
镜像体积
虚悬镜像(dangling image)
一个特殊的镜像，这个镜像既没有仓库名，也没有标签，均为 <none>
一般来说，虚悬镜像已经失去了存在的价值，是可以随意删除的，可以用docker image prune删除。
中间层镜像
为了加速镜像构建、重复利用资源，Docker 会利用 中间层镜像
默认的 docker image ls列表中只会显示顶层镜像，如果希望显示包括中间层镜像在内的所有镜像的话，需要加 -a参数。
列出部分镜像
docker image ls还支持强大的过滤器参数 --filter，或者简写 -f
以特定格式显示
--filter配合-q产生出指定范围的 ID 列表，然后送给另一个 docker命令作为参数
删除本地镜像
如果要删除本地的镜像，可以使用 docker image rm命令
用 ID、镜像名、摘要删除镜像
列: docker image rm 501
Untagged 和 Deleted
如果观察上面这几个命令的运行输出信息的话，你会注意到删除行为分为两类，一类是 Untagged，另一类是 Deleted
利用 commit 理解镜像构成
当我们运行一个容器的时候（如果不使用卷的话），我们做的任何文件修改都会被记录于容器存储层里。而 Docker 提供了一个 docker commit
 命令，可以将容器的存储层保存下来成为镜像。换句话说，就是在原有镜像的基础上，再叠加上容器的存储层，并构成新的镜像。以后我们运行这个新镜像的时候，就会拥有原有容器最后的文件变化。
## bash命令
docker commit [选项] <容器ID或容器名> [<仓库名>[:<标签>]]
BashCopy
慎用 docker commit !
使用 docker commit命令虽然可以比较直观的帮助理解镜像分层存储的概念，但是实际环境中并不会这样使用。
💡
注意： docker commit命令除了学习之外，还有一些特殊的应用场合，比如被入侵后保存现场等。但是，不要使用 docker commit定制镜像，定制镜像应该使用 Dockerfile来完成。如果你想要定制镜像请查看下一小节。
使用 Dockerfile 定制镜像
Dockerfile 是一个文本文件，其内包含了一条条的 指令(Instruction)，每一条指令构建一层，因此每一条指令的内容，就是描述该层应当如何构建。
FROM nginx
RUN echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html
BashCopy
FROM 指定基础镜像
RUN 执行命令
构建镜像 docker build [选项] <上下文路径/URL/->
镜像构建上下文（Context）docker build命令最后有一个 .
其他命令
COPY 复制文件
ADD 更高级的复制文件
ADD指令和COPY的格式和性质基本一致。但是在COPY基础上增加了一些功能。
CMD 容器启动命令
CMD 指令的格式和 RUN 相似，也是两种格式：
shell 格式：CMD <命令>
exec 格式：CMD ["可执行文件", "参数1", "参数2"...]
参数列表格式：CMD ["参数1", "参数2"...]。在指定了 ENTRYPOINT 指令后，用 CMD 指定具体的参数。
ENTRYPOINT 入口点
ENTRYPOINT的格式和 RUN指令格式一样，分为 exec格式和shell格式。
ENTRYPOINT的目的和 CMD一样，都是在指定容器启动程序及参数。ENTRYPOINT在运行时也可以替代，不过比 CMD要略显繁琐，需要通过 docker run的参数 --entrypoint来指定。
ENV 设置环境变量
ARG 构建参数
格式：ARG <参数名>[=<默认值>]
VOLUME 定义匿名卷
格式为:
VOLUME ["<路径1>", "<路径2>"...]
VOLUME <路径>
EXPOSE 暴露端口
格式为 EXPOSE <端口1> [<端口2>...]。
WORKDIR 指定工作目录
格式为 WORKDIR <工作目录路径>。
 USER 指定当前用户
格式：USER <用户名>[:<用户组>]
 HEALTHCHECK 健康检查
格式：
HEALTHCHECK [选项] CMD <命令>：设置检查容器健康状况的命令
HEALTHCHECK NONE：如果基础镜像有健康检查指令，使用这行可以屏蔽掉其健康检查指令
ONBUILD 为他人作嫁衣裳
格式：ONBUILD <其它指令>
Dockerfile 多阶段构建
一种方式是将所有的构建过程编包含在一个 Dockerfile 中，包括项目及其依赖库的编译、测试、打包等流程，这里可能会带来的一些问题：
镜像层次多，镜像体积较大，部署时间变长
源代码存在泄露的风险
另一种方式，就是我们事先在一个 Dockerfile将项目及其依赖库编译测试打包好后，再将其拷贝到运行环境中，这种方式需要我们编写两个 Dockerfile和一些编译脚本才能将其两个阶段自动整合起来，这种方式虽然可以很好地规避第一种方式存在的风险，但明显部署过程较复杂。
为解决以上问题，Docker v17.05 开始支持多阶段构建 (multistage builds)。使用多阶段构建我们就可以很容易解决前面提到的问题，并且只需要编写一个 Dockerfile
其它制作镜像的方式
从 rootfs 压缩包导入
使用 BuildKit 构建镜像
Docker 镜像是怎么实现增量的修改和维护的？
每个镜像都由很多层次构成，Docker 使用 Union FS 将这些不同的层结合到一个镜像中去。
通常 Union FS 有两个用途, 一方面可以实现不借助 LVM、RAID 将多个 disk 挂到同一个目录下,另一个更常用的就是将一个只读的分支和一个可写的分支联合在一起，Live CD 正是基于此方法可以允许在镜像不变的基础上允许用户在其上进行一些写操作。
Docker 在 AUFS 上构建的容器也是利用了类似的原理。
 
`

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'summarg' })
}
