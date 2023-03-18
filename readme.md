# japt-next

This repo is for development of a successor to the golfing language [Japt](https://github.com/ETHproductions/japt), which is no longer maintained.

You must have NodeJS installed to run this locally.

Eventually, I will set up a NPM package for this, but for now, you can use this by: 
1. Clone the repo
2.  ```sh
    pnpm link -g
    ```
3. Use:
    ```sh
    japt compile < program.japt # transpile to JS
    japt run < program.japt # interpret (very few functions have been implemented yet)
    echo 'program' | japt run # you don't have to save the program to a file
    ```
