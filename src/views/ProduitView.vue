<template>
    <main>
        <div>
            <!-- Un formulaire pour saisir les valeurs de la catégorie à ajouter -->
            <form @submit.prevent="ajouteProduit">
                <div>
                    <input id="libelle" v-model="data.formulaireProduit.libelle" placeholder="Libelle" />
                </div>
                <div>
                    <input id="description" v-model="data.formulaireProduit.description" placeholder="Description" />
                </div>
                <button type="submit">Ajouter</button>
            </form>
        </div>
        <div>
            <table>
                <caption>Liste des produits {{ data.numeroPage }} / {{ data.pageMax }}</caption>
                <tr>
                    <th>Nom</th>
                    <th>Prix</th>
                    <th>Stock</th>
                    <th>Commandés</th>
                    <th>Action</th>
                </tr>
                <!-- Si le tableau des catégories est vide -->
                <tr v-if="!data.listeProduits">
                    <td colspan="4">Veuillez patienter, chargement des produits...</td>
                </tr>
                <!-- Si le tableau des catégories n'est pas vide -->
                <tr v-for="produit in data.listeProduits" :key="produit.code">
                    <td>{{ produit.nom }}</td>
                    <td>{{ produit.prixUnitaire }}</td>
                    <td>{{ produit.unitesEnStock }}</td>
                    <td>{{ produit.unitesCommandees }}</td>
                    <td>
                        <button @click="deleteEntity(produit._links.self.href)">
                            Supprimer
                        </button>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <button @click="changePage('begin')"><img src="../img/keyboard_double_arrow_left_FILL0_wght400_GRAD0_opsz48.png"/></button>
                        <button @click="changePage(-1)"><img src="../img/arrow_back_FILL0_wght400_GRAD0_opsz48.png"/></button>
                        <button @click="changePage(1)"><img src="../img/arrow_forward_FILL0_wght400_GRAD0_opsz48.png"></button>
                        <button @click="changePage('last')"><img src="../img/keyboard_double_arrow_right_FILL0_wght400_GRAD0_opsz48.png"/></button>
                    </td>
                </tr>
            </table>
        </div>
    </main>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { BACKEND, doAjaxRequest } from "../api";

// Pour réinitialiser le formuaire
const produitVide = {
    reference: "",
    nom: ""
};

let data = reactive({
    // Les données saisies dans le formulaire
    formulaireProduit: { ...produitVide },
    // La liste des catégories affichée sous forme de table
    listeProduits: [],
    numeroPage: 0,
    pageMax: 0
});

function changePage(page) {
    if(page === 'begin'){
        data.numeroPage = 0;
        chargeProduits();
    }
    else if(page == 'last'){
        data.numeroPage = data.pageMax;
        chargeProduits();
    }
    if(data.numeroPage + page >= 0 && data.numeroPage + page <= data.pageMax){
        if(data.numeroPage <= data.pageMax && data.numeroPage >= 0){
            data.numeroPage = data.numeroPage + page;
            chargeProduits();
        }
    }
}

function chargeProduits() {
    // Appel à l'API pour avoir la liste des catégories
    // Trié par code, descendant
    // Verbe HTTP GET par défaut
    doAjaxRequest(BACKEND + "/api/produits?page="+ data.numeroPage + "&size="+ 5 + "&sort=code")
        .then((json) => {
            data.listeProduits = json._embedded.produits;
            data.pageMax = json.page.totalPages;
        })
        .catch((error) => alert(error.message));
}

function ajouteProduit() {
    // Ajouter une catégorie avec les données du formulaire
    const options = {
        method: "POST", // Verbe HTTP POST pour ajouter un enregistrement
        body: JSON.stringify(data.formulaireProduit),
        headers: {
            "Content-Type": "application/json",
        },
    };
    doAjaxRequest(BACKEND + "/api/produits", options)
        .then(() => {
            // Réinitialiser le formulaire
            data.formulaireProduit = { ...produitVide };
            // Recharger la liste des catégories
            chargeProduits();
        })
        .catch((error) => alert(error.message));
}
/**
 * Supprime une entité
 * @param entityRef l'URI de l'entité à supprimer
 */
function deleteEntity(entityRef) {
    doAjaxRequest(entityRef, { method: "DELETE" })
        .then(chargeProduits)
        .catch((error) => alert(error.message));
}

// A l'affichage du composant, on affiche la liste
onMounted(chargeProduits);

</script>


<style scoped>
td,
th {
    border: 1px solid #ddd;
    padding: 8px;
}


th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #232623;
    color: rgb(255, 255, 255);
}
</style>