# Architecture

## Indexed song data

Below is an example of the song index. This data will be some file in the `public/` directory.

```
title:artist:relative-path
永遠的依靠:陳國富 Edward Chen:0.json
十架犠牲的愛:馮鑑邦:1.json
```

As you can see, this is a set of colon-separated values. It's easy and simple: a colon counts as
a separator, and to escape a colon, just add a backslash. Another option would be to use tab-separated
values, because there's an extremely small probability that songs or author names would have tabs in them.

As for the filename, we could do an auto-incrementing system, or some sort of hashing system (based on
title and artist), or we could use a UUID system for randomly generating them (there's a non-zero chance
of collision).

## Cached song data

Below is an example of a cached song. This data will be some file in the `public/` directory.

```js
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
}
```

It can probably be extended and customized by adding links to background images (bad idea) and whatnot. Do
note that it is basically the `song` data from the [save data](#save-data) verbatim. The thing I want to
ensure is that a single save data object is able to reproduce the powerpoint completely, even if there is
no internet.

Below are the lyrics which directly convert to the `parts` key.

```
Verse:
每次我難關當中
祢定與我同行
來分享生命的豐富
來讓我蒙福

每次我煩憂當中
祢為我已籌謀
平安盼望在我心裡
前路共祢同闖

Chorus:
祢是永遠心裡依靠
信心堅守去宣告
親身經歷感受
全是祢大能

唯獨祢是永遠心裡依靠
信心堅守去宣告
當我專注的跪拜
祢的恩典已在這裡
```

Each part of the song is identified by an identifier that doesn't need to be unique, which is denoted by
having the line

1. Be the beginning of a new paragraph
2. End with a colon

Do note that lines which are not identifying lines now cannot end in a colon.

A part of a song can be represented by multiple slides, which translate to paragraphs separated by 1 or
more empty lines.

In the example given above, the two identifiers `Verse` and `Chorus` denote the beginning of the two
parts. Both parts consist of 2 slides, which consist of 4 lines.

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
