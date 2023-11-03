# pf2e-grognardify

This script reverts the terminology changes in the [Pathfinder 2e system for Foundry](https://github.com/foundryvtt/pf2e).

Languages are back to Sylvan, Aquan, Terran, Ignan, and Auran. It is called flat-footed again. Unseen Servant is Unseen Servant once more.

It does not revert mechanical changes.

I wrote a house rule merging Foundry module a couple of years ago, and use that tech for such purposes. I am sorry to say it is in no condition for public release. It is even more embarrassing than this script is. I am trying to clean it up for a proper release.

## Standard Disclaimer

This is firstly my pet project, for my own campaigns. It is a hack job and the code quality reflects this. I am releasing this because I have seen people "Sticking with 5.2" and other such misery.

People who want to help this along in some direction are welcome to contribute. For now, I am releasing this 'as-is'.

## !!!Warning!!!

If you incorporate this into an ongoing campaign, it won't correct the reverted terminology that already exists in your world. I have been maintaining this since 5.3, and haven't had a need to make a proper world migration script. I will likely have to do so at some point, but it is not now.

Take heed.

## Instructions

**1)** Set up the [PF2e development environment](https://github.com/foundryvtt/pf2e/blob/master/CONTRIBUTING.md) as normal, per their instructions.

**2)** Checkout the latest tag this script supports.

`git checkout 5.8.3 --force`

(If you are updating, you will likely need to run `git fetch` first.)

**3)** Delete the `/src` directory from your local copy of the official repo.

**4)** Copy the `pf2e-grognardify.js`, any .json files, and `/src` from this repo to the pf2e dev folder (where you just deleted the /src directory).

**5)** You will need to install a couple of npm packages 'locally'. From pf2e's dev folder:

`npm i glob`

`npm i graceful-fs`

**6)** Run `pf2e-grognardify.js` from the main pf2e directory:

`node ./pf2e-grognardify.js`

**7)** If it tells you are on the wrong version, checkout the correct version it specified with `--force`, above. The wrong version will almost certainly not function.

**8)** If it lists a few thousand files and exits normally, congratulations! Build your package and have fun:

`npm run build`

## Licensing Notes

By necessity, this is currently a 'build it yourself' script.

Image licensing for the PF2e system in Foundry is a mess and I do not have time to replace ~4,000 images.

Because some pack content is ORC licensed, I would have to gain Paizo's permission to release the built package sans (most) images. 

It would be possible to create a version with no ORC-licensed content, but this would require some combination of reworking Rage of the Elements and/or rewriting a few spells whose names are released under OGL but descriptions only under ORC. As this isn't my reason for doing this, I have not gone this route. I would be willing to assist someone in what needs to be done to make a releasable version of this, but it isn't a one-person project. 

## Why?

I've been toying with the idea of forking PF2 - both the Foundry package and the system itself - for some time now. For the most part, it's something I do not have the proper time for. Maintaining this has become quite fast, instead. This way the possibility of doing so can still tease me. In the meantime, it has been an educational experience.

tl;dr: Because I want to.
