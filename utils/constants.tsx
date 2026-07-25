import { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = React.ComponentProps<
  typeof MaterialCommunityIcons
>['name'];

export  const itemTypes = {
    OFFERS : "offers",
    OFFERS_TAG : "Intercambio",
    OFFERS_COLOR : { color: "#4D1162" },
    OFFERS_ICON : "chevron-right-circle" as IconName,
  
    SEARCHING: "searching",
    SEARCHING_TAG : "Por",
    SEARCHING_COLOR : { color: "#652FE8" },
    SEARCHING_ICON : "chevron-left-circle" as IconName,
  
    DONATION: "donation",
    DONATION_TAG : "Dono",
    DONATION_COLOR : { color : "#FF7A00" },
    DONATION_ICON : "checkbox-blank-circle" as IconName
  }
  
  export const AreaType = {
    REGION: "region",
    COMMUNE: "commune"
  }
  
  export const ItemStatus = {
    PENDING: "pending",
    ACCEPTED: "accepted",
    REJECTED: "rejected",
    CANCELLED: "cancelled",
    COMPLETED: "completed"
  }
  
  // export const categoryImages = {
  //   tecnologia  : require('../../assets/categories/tecnologia.png'),
  //   hogar       : require('../../assets/categories/hogar.png'),
  //   deporte     : require('../../assets/categories/deporte.png'),
  //   vehiculos   : require('../../assets/categories/vehiculos.png'),
  //   belleza     : require('../../assets/categories/belleza.png'),
  //   musica      : require('../../assets/categories/musica.png'),
  //   herramientas: require('../../assets/categories/herramientas.png'),
  //   juguetes    : require('../../assets/categories/juguetes.png'),
  //   clases      : require('../../assets/categories/clases.png'),
  //   moda        : require('../../assets/categories/moda.png'),
  //   alimentacion: require('../../assets/categories/alimentacion.png'),
  //   supermercado: require('../../assets/categories/supermercado.png'),
  //   sustentables: require('../../assets/categories/sustentables.png'),
  //   otros       : require('../../assets/categories/otros.png')
  // }