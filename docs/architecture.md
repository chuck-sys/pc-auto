# Architecture

## Save data

Below is an example of the data required to create a presentation. This is the data that will be fed into
the function that allows the user to download the presentation.

```js
{
    presentationDate: "2023-06-19",
    songs: [
        {
            title: "永遠的依靠",
            artist: "陳國富 Edward Chen",
            lyricist: "盧淑儀",
            parts: [
                {
                    // Insert 2 slides every time this part is referenced
                    name: "Verse",
                    lyricsBySlide: [
                        [
                            "每次我難關當中",
                            "祢定與我同行",
                            "來分享生命的豐富",
                            "來讓我蒙福",
                        ],
                        [
                            "每次我煩憂當中",
                            "祢為我已籌謀",
                            "平安盼望在我心裡",
                            "前路共祢同闖",
                        ]
                    ]
                },
                {
                    name: "Chorus",
                    lyricsBySlide: [
                        [
                            "祢是永遠心裡依靠",
                            "信心堅守去宣告"
                            "親身經歷感受",
                            "全是祢大能",
                        ],
                        [
                            "唯獨祢是永遠心裡依靠",
                            "信心堅守去宣告",
                            "當我專注的跪拜",
                            "祢的恩典已在這裡",
                        ]
                    ]
                }
            ],
            displayMetadata: false,
        }
    ],
    scriptures: [
        {
            identifier: "Matthew 1:1-13",
            verses: [
                "This is the genealogy of Jesus the Messiah the son of David, the son of Abraham:",
                "Abraham was the father of Isaac,\nIsaac the father of Jacob,\nJacob the father of ...",
                "...",
                "...Eliakim the father of Azor,"
            ]
        }
    ],
    parts: [
        {
            type: "welcome",                    // All parts must specify what type they are
        },
        {
            type: "song",
            songId: 0,                          // References the first song on the list
            songPart: 0,                        // References the first part of the song
            displayMetadata: true,              // Option that you can configure (overrides default)
        },
        {
            type: "song",
            songId: 0,
            songPart: 1,
        },
        {
            type: "callToWorship",
        },
        {
            type: "song",
            songId: 0,
            songPart: 0,
        },
        {
            type: "song",
            songId: 0,
            songPart: 1,
        },
        {
            type: "song",
            songId: 0,
            songPart: 1,
        },
        {
            type: "verseByVerseResponse",       // IDK what it's called
            scriptureId: 0,                     // References the first scripture on the list
            isLastVerseSaidTogether: true,      // Option that you can configure
        }
    ],
    fontSize: 48,                               // Global configuration values
}
```

The rest of the functions on the site serve to edit this object. For instance, some method is required in
parsing the output of scripture API. Another method (which probably relies a bit on human oversight) is
required in parsing the output of song API to partition each song into chunks of verses, choruses, and
bridges.

Another issue would be how we know when a line is too long and we must break it. Or when there are too
many lines such that we need a new slide (the case with the scriptures).

## API references

- Song database: https://cantonhymn.net
- RCUV: http://rcuv.hkbs.org.hk
