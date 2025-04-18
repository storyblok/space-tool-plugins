# Story Starter

The Story Starter is a [Space Plugin](https://www.storyblok.com/docs/plugins/custom-application) template that appears on the sidebar of your Storyblok space. It offers essential features for retrieving stories, enabling users to select specific ones, and performing actions. You can implement the actions you want to perform in `stories.config.ts`.

<p align="center">
  <img src="./docs/screenshot1.png" alt="Screenshot 1" width="600" />
</p>
<p align="center">(↑ Story Starter)</p>

<p align="center">
  <img src="./docs/screenshot2.png" alt="Screenshot 2" width="600" />
</p>
<p align="center">(↑ You can define actions like "Delete" in <code>stories.config.ts</code>)</p>

## Getting Started

> [!NOTE]
> Currently, the Story Starter is written only in Nuxt. However, please inform us if you would like to have a Next.js version. Feel free to create a GitHub issue to make the request.

```sh
npx giget@latest gh:storyblok/space-tool-plugins/space-plugins/nuxt-story-starter YOUR-PROJECT-NAME
```

To learn more about the configuration, read the [nuxt-starter's README](https://github.com/storyblok/space-tool-plugins/tree/main/space-plugins/nuxt-starter#configuration).

## Customization

Open the `stories.config.ts` file and implement your own actions. You can refer to the existing sample implementation for guidance.
