This is my attempt to build React and Next.js minimally, so that I finally
understand what hydration errors are.

Install everything using `npm i`

Run `nodemon --watch src --ext ts,tsx --exec "npx webpack"` to create a
`bundle.js`. This `bundle.js` is made available to `index.html` using a script
tag and does all the magic.

### Resources

1. [Build your own react](https://pomb.us/build-your-own-react/)
2. [Makeshit Next.js from Scratch](https://www.youtube.com/watch?v=3RzhNYhjVAw)
3. [RSC from scratch](https://github.com/reactwg/server-components/discussions/5)
