# Sirius Immersion Days - Student Guide

## Goal
Provide a basic foundation in container concepts in general and Kubernetes specifically.  The agenda is structured so that we can stop as time or knowledge dictates.  Each group of demo exercises builds on the previous.

## Lab 1 - Deploy Your First App 

All the deployment artifacts for this lab can be found in the `~/dev/k8s-demo/a-core` directory inside the lab container.

1. Create your first pod.
   1. `oc apply -f pod.yaml` will create and run your first OpenShift application. 
   2. You can see the running pod from the OpenShift console or with `oc get pods`.  
   3. More detailed information about the pod can be found with `oc get pods -o wide`, `oc describe pod/a-pod` or `oc get pod/a-pod -o yaml`.
   4. Delete the pod from the OpenShift console or with `oc delete pod/a-pod`.
2. Create a pod with two running containers.
   1. `oc apply -f pod-multi.yaml` will create and run a pod with two containers.
   2. You can see the running pod from the OpenShift console or with `oc get pods`.  Notice the `2/2` - this indicates that there are two containers defined and running 'in' the pod.
   3. You can explore the pod in more detail in the same way you did with your first pod.
   4. Monitor the logs from the two containers in this pod from the OpenShift console or with `oc logs -f a-pod --all-containers`.
   5. Gain access to one of the pod containers via a shell from the OpenShift Console or with `oc exec -it a-pod -c a-one sh`.
   6. Delete the pod in the same way as your first pod.
3. Create and run a deployment.
   1. `oc apply -f dep.yaml`.  The results will be noticeably different.
   2. The OpenShift console or `oc get all` will show that a deployment (a-dep) has been created along with three pods (a-dep-xxxxxx-yyyy).  You will also see a replicaset, which is an intermediary object that OpenShift creates automatically.
   3. A deployment always reconciles the desired state (in this example, simply three pods) with the current state.  If there is a difference, OpenShift will resolve it automatically.
      1. Delete one of the running pods from either the OpenShift console or with `oc delete pod/a-dep-xxxxxx-yyyy`.  Notice that almost immediately OpenShift recreates a new pod to being the deployment back to it's desired state.
      2. Delete the replica set from either the OpenShift console or with `oc delete rs/a-dep-xxxxxx`.  OpenShift can tolerate a major disruption and automatically bring the deployment back to it's desired state.
4. Using the same tools and procedures as these first examples, feel free to experiment with the other YAML documents in the `a-core` directory.  In particular - `job.yaml`, `cronjob.yaml` and `daemonset.yaml`.


## Lab 2 - Deploy a Multi-Tier App

In this lab you will deploy a simple application with server, console and consumer components.  You will be able to scale the components up and down and investigate how OpenShift "stiches" them together.

All the deployment artifacts for this lab can be found in the `~/dev/k8s-demo/k-simple-http` directory inside your lab container.

1. Deploy the server and console components called the Counter.
   1. `oc apply -f counter.yaml`.
   2. Use the OpenShift console or `oc get all` to see the objects deployed.  You'll see a new object called a Service.  A Service exposes the counter web server (listening on port 8181) to other workloads in the cluster.
      1. Question: How does OpenShift distinguish between the many Counter now running in the cluster?  What makes your Counter unique compared to your neighbors?
   3. Use the OpenShift console or `oc apply -f ocp/route.yaml` to expose your Counter service to the public internet.
      1. Use the OpenShift console to inspect the route and determine the generated URL to access your workload.
      2. In your browser you can access the Counter console with that URL.  Notice there isn't much going on yet.
   4. Use the OpenShift console or `oc apply -f pounder.yaml` to create a deployment that will begin to consume the Counter service.
      1. Notice that a new deployment is created along with two pods.
      2. Those pods will also appear in the Counter console.
   5. Use the OpenShift console or `oc scale deploy/pounder --replicas 4` to scale the number of Pounder replicas.
      1. After a brief spin up, you'll notice that the number of pods has increased as well as the Consumers recognized by the Counter.
      1. Feel free to scale up/down the Consumer deployment (Please don't scale up past 5!!).  Note that `0` is a valid replica count.
2. Use the OpenShift console or `oc delete pod/counter-xxxxxx-yyyy` to delete the single pod in the Counter deployment.
   1. Notice that OpenShift immediately creates a new instance of the pod to maintain the desired state of the Counter deployment.
   1. Also notice the the Consumer workload immediately recognizes the new Counter.  Since the state is ephemeral in this application, it is lost, but OpenShift dynamically "repaired" the workload.


## Lab 3 - Dynamically Scaling Workloads
