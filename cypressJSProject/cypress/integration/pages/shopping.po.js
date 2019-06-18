export class ShoppingPage{

    openCart(){
        cy.get('.bag--float-cart-closed').click();
    }

    closeCart(){
        cy.get('.float-cart__close-btn').click();
    }

    checkoutCart(){
        cy.get('.buy-btn').click();
    }

    deleteItemFromCart(){
        cy.get('.shelf-item__del').click();
    }

    selectItem(name){
        cy.get('.shelf-container').find('p').contains(name).parent().click();
    }
}

export const shoppingPage=new ShoppingPage();