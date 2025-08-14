# Testing Locally

To test this project locally:

1. Open the project folder in **VS Code**.
2. Right-click on `index.html`.
3. Select **Open with Live Server**.

![Live Server Instructions](docs/image.png)

# Code Walkthrough

## core

This is the engine behind everything. It's a drag and drop folder that can be used to start off any project. It has components and managers.

#### components

Pretty much everything is a component. A screen is a component. The player is a component. Projectiles and enemies are components. Components can be parents to other components. This folder contains a set of components that are universal enough between multiple projects that they are part of the core engine. Everything extends BaseComponent, which on its own, contains logic for maintaining information on where something is on the screen and how big it is, whether it uses a sprite, whether it uses a z-index to put itself in front of or behind other things, whether its temporarily hidden, and whether it's subscribed to any events. It has a purge function to easily remove itself from the game as well.

#### managers

AudioManager loads and plays audio, DrawManager has some drawing logic to deal with z-indexing and calls the draw function in the component tree, PreloadManager can designate a set of assets to load ahead of time, and SpriteManager has logic to load sprites and draw them to the screen.

## data

Generally where json data is stored as in the case of levelData and playerChars.

assetPaths tells the Audio and Sprite managers where to find the audio and graphics files. Note that there are base sprites, mini sprites, animated sprites, and processed sprites. A regular sprite means that the image file is the sprite itself, nothing more. A minisprite means that there is a sprite sheet containing multiple sprites, so the size and location must be specified. Animated sprites are essentially a series of minisprites. And processed sprites are ones that take an existing sprite, and apply some transformation to make a new sprite, instead of needing to make a new file. i.e. if you want to create a new sprite that is exactly the old one but all red, to show it taking damage.

## draw

All the game-specific components and logic are here. The folders are different screens, and each screen has its sub-components. It all starts from root, and titleScreen is a good example of combining sprite, text, shape, and click handler components.

The gameplay all happens within the gameplayScreen's index and Player files. Enemies and platforms are added into there based on the levels.

## event

This is meant to be moved into core. It has a Dispatcher that maintains all of the subscriptions to events. Anything can subscribe to an event, and anything can emit an event. This is how components receive mouse click and key presses. This folder also has event emitters for mouse, keyboard, websockets, device tilt, and shape collisions.

## img

Just an asset folder with all the images

## state

Not used currently in this project, but contains logic for reading feature flags from the URL if needed, as well as saving and loading game data to and from localStorage.

## util

This is meant to be moved into core. arrayUtil has functions that make it easier to randomize lists, coordUtil has functions for coordinate geometry, including determining whether two shapes are colliding, whether a point is in a shape, as well as applying movement to a coordinate in some direction. imageUtil can manipulate images, but right now its just a single masking function to change a sprite to a different color. If you look at the processedSprites in assetPaths, this functionality is used there to generate a red sprite for the damage flicker effect. MathUtil has functions for vector arithmetic, and other mathy things like quadratic formula.

## Outside stuff

index.html - This is where the aspect ratio of the canvas is set

index.js - The entry point of the code. Starts up the DrawManager, and wakes up the event emitters.