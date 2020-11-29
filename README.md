# Manticore
🎨 Simple animation library for vue-phalanx

# [click for demo](https://codesandbox.io/s/gallant-platform-5g873?file=/index.html)

<p align="center">
  <img width="500px" src="https://i.pinimg.com/originals/4b/fd/5f/4bfd5feb3cf9847f8bf92d84745aea6e.jpg">
</p>


#### 🚨 note: `this package is built to handle vue-phalanx animations.`

> The manticore is a Persian legendary creature similar to the Egyptian sphinx.

## usage: 
```javascript
        import Manticore from "@mediv0/manticore";
        Manticore.from({
            target: ".box", // element for animation
            left: 400,     //  animation from left direction    use negative number for right direction   eg =>  left: -400
            top: 0,       // animation from top direction    use negative number for bottom direction   eg =>  top: -400
            duration: 2, // duration of your animation in seconds   2 -> 2 seconds
            easing: "easeInOutCirc" // use to change animation timing.  default => easeInOutSine
        });
```


## availble easing functions

| ease          |   
|---------------|
| easeInOutSine |  
| easeInOutCirc |   
| easeInOutQuad | 
| easeInOutCubic |  
| easeOutBounce |
