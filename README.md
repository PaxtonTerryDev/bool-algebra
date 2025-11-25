# bool-algebra

This is just a file that outlines a basic framework for type comparisons. 

This was originally built to drive form behaviors (if field 1 is not equal to field 2, do this)

Not big or complicated enough to justify a package. Just copy paste the main.ts file into your project and do as you wish.

The main logic is separated from a more functional application of it with a big '====' comment line, scroll down and you can't miss it.  This was more specific to my use. so you should be able to delete it if you don't need it.

## Use

You can use this pretty easily -> the only export is the `createPredicate` function with it's overrides.

```typescript
const p = createPredicate("SomeValue");
const result = p.isNot().equalTo("DifferentValue");
// result = true
```

`createPredicate` will take the type of the argument and return a class instance that provides relevant methods. For example, 

```typescript
const strPredicate = createPredicate("SomeValue");
const intPredicate = createPredicate(42);

// invalid - doesn't make much  sense to greater than compare two strings
strPredicate.greater("OtherValue");

// valid 
intPredicate.greater(20);
```

_Note: I know it's a legal operation, but it's not a logically consistent one, so I didn't want to make it available._


## How It Works

The main export is `createPredicate` – pass it anything and it'll return an object with methods like `equalTo()`, `greaterThan()`, etc. that actually make sense for that type.

Numbers and dates get the full set of comparisons (greater/less than), everything else gets equality checks. There's also an `isNot()` method you can chain to flip the result, so you can do stuff like `createPredicate(x).isNot().equalTo(y)`.

Internals handle normalizing values and picking the right comparator function based on type. The API is deliberately constrained so you can't do nonsense like "is this string greater than that other string" – basically trying to prevent bugs before they happen.

Below the actual implementation there's a demo (look for the big `====` comment separator) showing how you might use this for form validation or conditional UI logic. The whole thing is in main.ts with zero dependencies, so you can just grab it and drop it in your project. Use the example or delete it, whatever works.

Pretty minimal API overall, but easy to extend if you need more comparison types or localization stuff down the road.