---
layout: default
title: All Your Base Are Belong To Us
js: app.js
css: app.css
---

There's an important difference between a number and how we *represent* that number.

For example, no matter how we represent it the number ten is always even, it's always equal to two multiplied by five, and it's always the square-root of one hundred. But we can represent it in lots of different ways: the word “ten”, the Roman numeral “X”, or, most commonly, the decimal representation “10”.

“**Dec**imal” just means a number system based on ten - in the same way that a **dec**ade is ten years, a **dec**agon has ten sides, and **Dec**ember is the tenth month… [if you're a Roman](https://en.wikipedia.org/wiki/Roman_calendar#Republican_calendar). Such a number system is also known as “Base 10”.

But decimal isn't the only way to represent numbers and, importantly, it's not the way that computers represent numbers internally.

But before we look at the alternatives, let's look at decimal in a bit more detail.

## Base 10: Decimal

Most people, most of the time, use the decimal system for writing out numbers. It's probably because most people, most of the time, have ten fingers.

Consider the decimal number “1,024” - what does that actually mean? Starting from the *right*, it means:

- Four **one**s
- plus two **ten**s (also known as “twenty”)
- plus zero **hundred**s
- plus one **thousand**

In other words: (4 × 1) + (2 × 10) + (0 × 100) + (1 × 1,000). Which gives us one thousand and twenty four.

---

Now, I'm about to get a bit mathsy on you. Some people are scared of maths and switch off the second that they see it. But I'm not going to be doing anything complicated, just using “powers”.

A number, x, to some power, y – written x<sup>y</sup> – just means multiplying x by itself y times. For example:

- 10<sup>2</sup> = 10 × 10 = 100
- 10<sup>3</sup> = 10 × 10 × 10 = 1,000
- 10<sup>4</sup> = 10 × 10 × 10 × 10 = 10,000

Perhaps less obviously:

- 10<sup>1</sup> = 10

That is to say, any number to the power of 1 is itself.

We also need to know:

- 10<sup>0</sup> = 1

That is, any number to the power of 0 is 1. This is far from obvious, but [can be shown in various ways](https://medium.com/i-math/the-zero-power-rule-explained-449b4bd6934d).

---

Now, getting back to “1,024” in decimal: four **one**s, two **ten**s, zero **hundred**s, and one **thousand**. You'll notice that going right from left, each symbol represents the number of the next power of ten. We could write it as follows:

<div style="text-align:center">
(4 × 10<sup>0</sup>) + (2 × 10<sup>1</sup>) + (0 × 10<sup>2</sup>) + (1 × 10<sup>3</sup>)
</div>

Or in the order we write numbers:

<div style="text-align:center">
(**1** × 10<sup>3</sup>) + (**0** × 10<sup>2</sup>) + (**2** × 10<sup>1</sup>) + (**4** × 10<sup>0</sup>)
</div>

Try typing different values into each part below to see it broken down:

<div class="js__base" data-base="10" data-default="1024"></div>

Hopefully there shouldn't be anything too surprising here: we are all used to working with decimal numbers, so the above example probably seems somewhat pointless.

But there's nothing inherently better about representing numbers in the decimal system.

## Base 2: Binary

“Binary” just means that rather than using 10 as the base, we use 2 instead. It's the system that computers use to represent pretty much everything.

For example consider the decimal “10”. In binary this is “1010”. Going from the *right*most symbol:

- Zero **one**s (0 × 2<sup>0</sup>)
- plus one **two** (1 × 2<sup>1</sup>)
- plus zero **four**s (0 × 2<sup>2</sup>)
- plus one **eight** (1 × 2<sup>3</sup>)

<div class="js__base" data-base="2" data-default="1010"></div>

Any number that can be represented in decimal can also be represented in binary.

There are pros and cons to storing things in binary. The obvious disadvantage is that most people don't find binary very easy to read.

> There are only 10 types of people: those that understand binary and those that don't

You'll also notice that the numbers are much longer: “15” requires four symbols and to represent “1024” requires eleven symbols.

But binary has one really nice advantage. You only need two values: “0” and “1”. These can be represented physically with *low* voltage and *high* voltage in electronic circuitry, making it perfect for computers.

It would be perfectly possible to create a computer that used the decimal system for representing numbers. But, computers have to store and transmit data physically, so to store ten possible symbols you'd need ten different physical states.

Have a play with binary below. Remember you can only use “0” and “1” and you won't be able to get higher than 63:

<div class="js__base" data-base="2" data-default="101010"></div>


## Base 16: Hexadecimal

Binary is great for computers, but, as we've already said, it's not very good for humans. Unfortunately if you convert a binary number to a decimal number there's not a consistent mapping between the number of symbols required to represent it: the four symbols binary number “1000” is “8” in decimal (one symbol) but the binary number “1010” is “10” in decimal (two symbols). This makes it difficult to work with.

If the base we use is a *power* of the original base, you will always get a consistent mapping. In the case of Base 16 (2<sup>4</sup>), four symbols of binary will always equal one symbol of hexadecimal.

However, you'll notice that we run out of digits: 0-9 only gives us ten options. So we need some more symbols to use. Rather than making up some new symbols, it's easiest just to use ones we've already got, so we use the letters “a” to “f”, giving us 16 characters (including 0):

- “a” = 10
- “b” = 11
- “c” = 12
- “d” = 13
- “e” = 14
- “f” = 15

This can look rather strange to start with, but, once you get used to it, it starts to make sense.

<div class="js__base" data-base="16" data-default="12beef"></div>

If you really get into hexadecimal then you can learn to [count in hexadecimal](https://en.wikipedia.org/wiki/Hexadecimal#Verbal_and_digital_representations) and [speak in hexadecimal](https://en.wikipedia.org/wiki/Hexspeak).


## Base 36: Hexatrigesimal

Base 36 isn't used much in computing, but it does have the fun property of allowing the whole alphabet as inputs (0-9 + a-z = 36 characters).

<div class="js__base" data-base="36" data-default="hello"></div>

## Base 60: Sexagesimal

[Base 60](https://en.wikipedia.org/wiki/Sexagesimal) also isn't used much in computing, but you probably use it every day without thinking about it when you look at what time it is. It's also commonly used for measuring angles and geographical coordinates.

Unfortunately, there's no standard set of symbols once you get past 0-9 and a-z, so I can't provide a standardised converter for that.

But let's not let that get in the way...

## All About That Base

Below is a converter where you can add as many symbols as you like to create your own base. I've added a few for you to start with.

<div class="js__base" data-default="🐶🦡🗿💩🐶" data-characters="🐶🦡🗿💩"></div>

---

The code for this post can be [found on GitHub](https://github.com/develop-me/blog-resources/tree/master/base)
