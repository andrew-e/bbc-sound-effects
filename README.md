Warning: this is a hacky solution I made over lunch time at work. There is almostl certainly bugs, and you will not learn from looking at this code.

# What does it do?

This downloads the BBC Sounds Effects library one wav file at a time.

You can run this script multiple times, and it will start where it left off!  You are definitely allowed to move / delete / alter the wav files (I imagine you'll want to delete a few), and it won't re-download them.  Please don't touch the `lastFileDownloaded.txt` file though.  If you do, the script will lose it's place and start over again.

## Disclaimer: 

1. If you only want a subset of the files, please go through BBCSoundEffects.csv and remove any row of a sound you aren't interested in.  This would be beneficial to both you and the BBC.
2. This shouldn't be parallelized cause the BBC wouldn't be very happy if we did.  I'm not sure they would be happy with this existing at all.
3. The 'picking up where you left off' functionality is dependant on the BBCSoundEffects.csv not changing.  If that csv changes order (or structure) this will do strange things.

## Instructions:

1. Installing Node: Before you are able to run this script, you need to be able to run the code.  To do that please follow the instructions here: https://nodejs.org/en/download/
2. Download files: Click on the green `Clone or Download` that appears at the top right of this very page!  Then click the `Download zip` button.
3. Unzip the contents and put in your favourite folder
4. Open the command line and change the directory to the one in step 3.
5. Run `npm install`.  This installs other dependencies in which this code needs to run
6. Run `node index.js`

This should start the process of downloading the wav files into the `sounds` directory.  You'll see if it's working by  
a. Seeing if files are showing up in `sounds`  
b. messages about which file is being downloaded and saved shows up on the command line

If by any chance, the process crashes or stops, you can re-run the program in step 6 and it should pick up where it left off.  I have added some retry logic around this, cause the socket timeout errors seem to happen fairly regularly (for me)

If you need to stop the program for whatever reason, you can press `crtl+c` in the command line.
