1- Construction de l'image docker du service

## docker build -t devlinnovlab/appointment-service:latest . 

2- Push de l'image sur le docker registry:

## docker push devlinnovlab/appointment-service:latest 

5- Deploiement du service sur le cluster kubernetese:

## kubectl apply -f .\kubernetes\redis-service.yaml
## kubectl apply -f .\kubernetes\redis-deployment.yaml

## kubectl apply -f .\kubernetes\appointment-service.yaml
## kubectl apply -f .\kubernetes\appointment-deployment.yaml

6- Acceder a l'url du service ross deployer

## minikube service appointment-service --url

7- Vérifiez que les pods sont en cours d'exécution et en bonne santé :

## kubectl get pods

8- Vérifier les logs du service

## kubectl logs <nom-du-pod-service>

12- Description du pod deploie
## kubectl describe pod <pod_name>

13- Voir les logs detailles d'un service deploie
## kubectl logs <pod_name> --previous

14- Tous les services
## kubectl get svc

15- Les pods
## kubectl get pods

16- Cette commande supprime les pods existants, et le Deployment les recréera automatiquement
## kubectl delete pod -l app=kong -n kong

11- Redirige le trafic reseau vers du service vers le port 8001 de la machine en local
## kubectl port-forward svc/kong-gateway 8001:8001

Pour rediriger le trafic reseau vers un DNS ( cree un tunnel ssh qui va acheminer le trafic en HTTP et HTTPS de la machine local vers le serveur DNS )
## ssh -L 8001:nom_de_domaine_ou_adresse_IP_distant:8001 -L 8443:nom_de_domaine_ou_adresse_IP_distant:8443 user@serveur_ssh

------------new-------------

Supprimer un namespace et toutes ses ressources
## kubectl delete namespace kong

Creation d'un new namespace
## kubectl create namespace kong

Liste des namespaces
## kubectl get namespaces

Supprimez le StatefulSet de PostgreSQL
## kubectl delete statefulset postgres -n kong

Listez les PersistentVolumeClaims (PVCs)
## kubectl get pvc -n kong

Supprimez le PVC associé à PostgreSQL
## kubectl delete pvc postgres-storage -n kong

Liste des secrets
## kubectl get secrets -n kong

Création d'un Secret pour PostgreSQL
## kubectl create secret generic pgcredentials --from-literal=POSTGRES_DB=exampledb --from-literal=POSTGRES_USER=exampleuser --from-literal=POSTGRES_PASSWORD=examplepassword -n kong

# Afficher le secret
kubectl get secret pgcredentials -n kong -o yaml

# Décoder un secret (pour les données codées en base64)
echo 'encoded-data' | base64 --decode

Modifier un secret
# kubectl edit secret pgcredentials -n kong

