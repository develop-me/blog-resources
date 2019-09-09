---
layout: default
title: All Your Base Are Belong To Us
js: /base/app.js
css: /base/app.css
---

There's an important difference between a number and how we *represent* that number.

For example, no matter how we represent it the number ten is always even, it's always equal to two multiplied by five, and it's always the square-root of one hundred. But we can represent it in lots of different ways: the word “ten”, the Roman numeral “X”, or, most commonly, the decimal representation “10”.

“**Dec**imal” just means a number system based on ten - in the same way that a **dec**ade is ten years, a **dec**agon has ten sides, and **Dec**ember is the tenth month ([if you're a Roman](https://en.wikipedia.org/wiki/Roman_calendar#Republican_calendar)). Such a number system is also known as “Base 10”.

But decimal isn't the only way to represent numbers and, importantly, it's not the way that computers represent numbers internally.

But before we look at the alternatives, let's look at decimal in a bit more detail.

## Base 10: Decimal

Most people, most of the time, use the decimal system for writing out numbers. It's probably because most people, most of the time, have ten fingers.

Consider the decimal number “1,024” - what does that actually mean? Starting from the right, it means 4 **ones**, plus 2 **tens** (twenty), plus 0 **hundreds**, plus one **thousand**: giving us one thousand and twenty four.

You'll notice that ten, one hundred, and one thousand are successive powers of 10: 10<sup>2</sup>, 10<sup>3</sup>, and 10<sup>4</sup>. In fact 1 is 10<sup>0</sup> - [*all numbers to the 0th power are 1*](https://medium.com/i-math/the-zero-power-rule-explained-449b4bd6934d). So going from the right, each digit represents the next power of ten.

But there's nothing inherently better about representing numbers in the decimal system.

<div class="js__base" data-base="10" data-default="1024"></div>

## Base 2: Binary

Any number that can be stored in a decimal representation can also be stored in a binary representation.

Binary the most efficient way to store numbers (in one sense): can count up to 1024 on your fingers - also the least efficient in that they're the longest numbers.

It would be perfectly possible to create a computer that used the decimal system for representing numbers. But, computers have to store and transmit data physically, so to store ten possible digits you'd need ten different physical states.

<div class="js__base" data-base="2" data-default="101010"></div>

## Base 16: Hexadecimal

Hex naming: [https://twitter.com/lizhenry/status/1165760903809130496](https://twitter.com/lizhenry/status/1165760903809130496)

<div class="js__base" data-base="16" data-default="ffee67"></div>

## Base 36: Hexatrigesimal

Base 36 isn't used much in computing, but it does have the fun property of allowing the whole alphabet as inputs (0-9 plus A-Z = 36 characters).

<div class="js__base" data-base="36" data-default="hello"></div>

## Base 60: Sexagesimal

Base 60: [https://en.wikipedia.org/wiki/Sexagesimal](https://en.wikipedia.org/wiki/Sexagesimal)

Base 60 also isn't used much in computing, but you probably use it every day without thinking about it when you look at what time it is. It's also commonly used for measuring angles and geographical coordinates.

Unfortunately, there's no standard set of symbols once you get past 0-9 and A-Z, so playing with Base 60 is a bit harder.

But let's not let that get in the way...

## All Your Base

<div class="js__base"></div>

---

The code for this post can be [found on GitHub](https://github.com/develop-me/blog-resources/tree/master/base)
