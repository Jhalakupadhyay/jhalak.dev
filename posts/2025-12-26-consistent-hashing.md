---
title: Consistent Hashing
date: 2025-12-26
summary: Why plain modulo hashing reshuffles every key when you add a server, and how a hash ring remaps only the keys that have to move.
tags: [system-design, hld, distributed-systems]
canonical: https://medium.com/@jhalak25upadhyay/consistent-hashing-ba2d8038e06f
---

#### Consistent I know but what is Hashing ? 🫤

Hashing is used to convert data of arbitrary length into a constant size value called hash codes or message digest or simply hashes, even a small change in input object gives a totaly different message digest. A good hash function is the one which is fast to compute and returns least [*collisions*](https://en.wikipedia.org/wiki/Hash_collision) (duplicate values).

![image explaining the hash function properties that i mentioned above.](/blog/consistent-hashing/hash-function.png)

#### Got it, now what is consistent hashing ?

> Consistent Hashing is a way by which when a hash table is resized then only n/m keys need to remapped where n is the number of keys and m is the slots.

Lets take an example :-
Suppose we are not using consistent hashing and we have 3 servers So, S1, S2 and there are 4 incoming requests R0, R1, R2, R3 and after passing these requests from hash function we get hash keys as 10, 22, 17, 08 and in order to distribute them between the servers we take modulo by the nummber of servers (3 in our case).

thus,

```
R0 -> 10 % 3 = 1/S1
R1 -> 22 % 3 = 1/S1
R2 -> 17 % 3 = 2/S2
R3 -> 08 % 3 = 2/S2
```

Now lets say we decide to add another server S3 and the load redistribution happens.

```
R0 -> 10 % 4 = 2/S2
R1 -> 22 % 4 = 2/S2
R2 -> 17 % 4= 1/S1
R3 -> 08 % 2= 0/S0
```

All of the data need to be remapped which leads to lost cache, massive data reshuffling which is quite expensive. Here the consistent hashing enters into the picture.

Consistent Haashing says, lets hash the servers also and put both the server and the request in a circular ring then the request that lies closer to the server will be redirected to that server.

so now lets say after hashing and distributing the servers

```
S0 -> 20
S1 -> 80
S2 -> 95
```

and requests after getting hashed generates the value.

```
R0 -> 18 -> goes to S0
R1 -> 27 -> goes to S0
R3 -> 65 -> goes to S1
R4 -> 90 -> goes to S2
```

and now when we add an extra server.
let’s say S3 -> 60

the requests gets remapped.

```
R0 -> 18 -> goes to S0
R1 -> 27 -> goes to S0
R3 -> 65 -> goes to S4
R4 -> 90 -> goes to S2
```

Only one request gets remapped saving lot of computation.

![Requests and servers placed on a consistent hashing ring](/blog/consistent-hashing/hash-ring.png)

#### Issue with this approach

With this approach if any server goes down then the server closest to it will get extra load and in order to solve this issue we can again hash the servers with some other hash function and map the server in the ring according to that such that there are multiple copies of the same server exists and if one server goes down then the load on that server which is now distributed evenly will get distributed to the nearest servers and there will not be load on a single server.
