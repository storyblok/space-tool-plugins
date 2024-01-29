# `space-plugin-nuxt-base` layer

This Nuxt layer adds basic authentication flow to your existing Storyblok's Space Plugin app.

## Configuration

In your `nuxt.config.ts`,

```js
export default defineNuxtConfig({
	extends: ['github:storyblok/space-tool-plugins/space-plugin-nuxt-base'],
});
```

and make sure you have the `.env` file.

```
CLIENT_ID=
CLIENT_SECRET=
BASE_URL=
```

To learn more about the configuration, read the [space-plugin-nuxt-starter's README](https://github.com/storyblok/space-tool-plugins/blob/main/space-plugin-nuxt-starter/README.md#configuration).
