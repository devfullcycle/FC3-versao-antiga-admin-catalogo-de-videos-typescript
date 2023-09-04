FROM node:14.17.0-slim

RUN mkdir -p /usr/share/man/man1 && \
    echo "deb http://archive.debian.org/debian stretch main" > /etc/apt/sources.list && \
    apt update && apt install -y \
    git \
    ca-certificates \
    default-jdk \
    zsh \
    curl \
    wget \
    fonts-powerline \
    procps


RUN npm install -g @nestjs/cli@8.2.5 npm@8.5.5

ENV JAVA_HOME="/usr/lib/jvm/default-jdk"

USER node

WORKDIR /home/node/app

RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v1.1.2/zsh-in-docker.sh)" -- \
    -t https://github.com/romkatv/powerlevel10k \
    -p git \
    -p git-flow \
    -p https://github.com/zdharma-continuum/fast-syntax-highlighting \
    -p https://github.com/zsh-users/zsh-autosuggestions \
    -p https://github.com/zsh-users/zsh-completions \
    -a 'export TERM=xterm-256color'

RUN echo '[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh' >> ~/.zshrc && \
    echo 'HISTFILE=/home/node/zsh/.zsh_history' >> ~/.zshrc 

CMD [ "tail", "-f" , "/dev/null" ]