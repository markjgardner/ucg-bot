#an image that runs the playwright tests
FROM mcr.microsoft.com/playwright:jammy
COPY ./playwright/ /app
WORKDIR /app
CMD npx playwright test -x --reporter null