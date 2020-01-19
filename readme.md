# Sirius Immersion Days - Student Guide

## Goal
Provide a basic foundation of the concepts in containers in general and Kubernetes specifically.  The agenda is structured so that we can stop as time or knowledge dictates.  Each group of demo exercises builds on the previous.

## Lab 1 - Deploy Your First App 

All the deployment artifacts for this lab can be found in the `~/dev/k8s-demo/a-core` directory inside your lab container.

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
   5. Gain access to one of the pod containers via a shell from the OpenShift Console or with `oc exec -it a-pod a-one sh`.
   6. Delete the pod in the same way as your first pod.
3. Create and run a deployment.
   1. `oc apply -f dep.yaml`.  The results will be noticeably different.
   2. The OpenShift console or `oc get all` will show that a deployment (a-dep) has been created along with three pods (a-dep-xxxxxx-yyyy).  You will also see a replicaset, which is an intermediary object that OpenShift creates automatically.
   3. A deployment always reconciles the desired state (in this example, simply three pods) with the current state.  If there is a difference, OpenShift will resolve it automatically.
      1. Delete one of the running pods from either the OpenShift console or with `oc delete pod/a-dep-xxxxxx-yyyy`.  Notice that almost immediately OpenShift recreates a new pod to being the deployment back to it's desired state.
      2. Delete the replica set from either the OpenShift console or with `oc delete rs/a-dep-xxxxxx`.  OpenShift can tolerate a major disruption and automatically bring the deployment back to it's desired state.
4. Using the same tools and procedures as these first examples, feel free to experiment with the other YAML documents in the `a-core` directory.  In particular - `job.yaml`, `cronjob.yaml` and `daemonset.yaml`.
