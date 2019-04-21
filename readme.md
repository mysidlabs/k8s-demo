# k8s-demo

## Goal
Provide a basic foundation of the concepts in containers in general and Kubernetes specifically.  The agenda is structured so that we can stop as time or knowledge dictates.  Each group of demo exercises builds on the previous.

## Prerequisites

A 'fast', reliable and open internet connection.  **In particular, jump.taranto.dev 1194/udp**.

## Prep
The following topics should be covered before demoing these examples --

1. Be clear that this is a Linux-centric demo.  Windows will not be covered, but most of the core concepts are the same.  The tooling concepts are largely the same too, with syntactical differences. 
1. Basic introduction of containers.  Comparison to VM's.
1. Define Terms
    1. Image
    1. Registry
    1. Repository
    1. Dockerfile
    1. Container
    1. Orchestrator - Swarm vs Kubernetes
1. Describe demo environment.
    1. 5 nodes, 1 master.  Call attention to best-practices around master re: count and non-schedulable.
    1. Arm Rock64's.  Similar to Pi's.  Beefier specs.
    1. Be clear the performance lacks in the environment in some cases. 
    1. We are demoing Kubernetes, not Docker.  Specfically call attention that no Docker tooling will be used beyond the Developer persona. 


## Demo Agenda

1. Core Concepts - Basic deployable Kubernetes primitives.
1. Storage - Examples of using storage.
1. Security - Specifically runtime.
1. Networking - Concepts other than ingress.
1. Targeted Deployment - Selectors, taints/tolerations, etc.
