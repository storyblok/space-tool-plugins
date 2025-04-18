# Storyblok Space/Tool Plugins

This repository is a collection of starters to help developers quickly start building their own Storyblok Tool plugins and Space plugins (legacy Custom Apps).

> This is an active repository that will be updated whenever there is a change in the way plugins interact with the Storyblok ecosystem. You can use it as a reference for your own plugins.

## Introduction

Inside each project you will find a detailed README.md file that will provide instructions on how to clone and run the code. Here is a short list of all projects inside of this repository:

- Space Plugins
  - [Nuxt Starter](space-plugins/nuxt-starter/README.md): Basic Nuxt starter
  - [Next.js Starter](space-plugins/nextjs-starter/README.md): Basic Next.js starter
  - [Story Starter](space-plugins/nuxt-story-starter/README.md): Nuxt starter packed with implementations for story-related actions
- Tool Plugins
  - [Nuxt Starter](tool-plugins/nuxt-starter/README.md): Basic Nuxt starter
  - [Next.js Starter](tool-plugins/nextjs-starter/README.md): Basic Next.js starter

## Glossary

- `Space Plugins`(also known as [Custom Sidebar Applications](https://www.storyblok.com/docs/plugins/custom-application)) are plugins that are present only once inside a space or organisation. Common Use-Cases for this kind of plugins are bulk operations on the content. One example of a Space Plugin is the [Broken Links Checker](https://www.storyblok.com/apps/storyblok-gmbh@broken-links-checker)

- `Tool Plugins` (also known as [Tools](https://www.storyblok.com/docs/plugins/tool)) are plugins that can be found within every story inside the tool section. These plugins usually provide operations on the story level. An example would be the [Export Translatable Fields Tool](https://www.storyblok.com/apps/export), which lets the user export all translatable fields of a story to either a JSON or XML format.
