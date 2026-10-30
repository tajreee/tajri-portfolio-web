FROM node:24-alpine@sha256:8a32c8cf649a49915a66e81e7a609223c708d0adabf288ee3f4077d765542f85 AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY index.html vite.config.ts tsconfig*.json ./
COPY src/ ./src/
COPY public/ ./public/
RUN npm run build

FROM nginxinc/nginx-unprivileged:stable-alpine@sha256:f5116ed4606f3eb015dd4a8e28cb9b351476dc0ad4bc6e9f93b19cec130cdf03 AS runtime

ARG GIT_COMMIT=unknown
LABEL org.opencontainers.image.title="Tajri Anhaar Portfolio" \
      org.opencontainers.image.source="https://github.com/tajreee/tajri-portfolio-web" \
      org.opencontainers.image.revision="${GIT_COMMIT}"

USER root
RUN rm -f /usr/share/nginx/html/index.html /usr/share/nginx/html/50x.html
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=build --chown=101:101 /app/dist/ /usr/share/nginx/html/

USER 101:101
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8080/healthz && wget -q --spider http://127.0.0.1:8080/index.html || exit 1
