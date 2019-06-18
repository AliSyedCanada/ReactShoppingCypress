import {
    shoppingPage
} from "./pages/shopping.po";

describe('React Shopping Application', () => {
    var dollar, cents;
    beforeEach(() => {
        cy.visit('/');
        cy.fixture('shopping').as('items')
    });

    it('Cart should contains zero products', () => {
        shoppingPage.openCart();
        cy.get('.bag__quantity').invoke('text').as('bagCartText');
        cy.get('@bagCartText').then(($text) => {
            expect($text).to.eql('0');
        });
        shoppingPage.closeCart();
    });


    it('Add a product to cart and it should have one product', () => {

        cy.get('@items').then((items) => {
            cy.get('.shelf-container').find('p').contains(items.tshirt).parent().find('.val').find('b').should(($dollarCost) => {
                dollar = $dollarCost.text();
            });
        });
        cy.get('@items').then((items) => {
            cy.get('.shelf-container').find('p').contains(items.tshirt).parent().find('.val').find('span').should(($centCost) => {
                cents = $centCost.text();
            });
        });

        cy.get('@items').then((items) => {
            shoppingPage.selectItem(items.tshirt);
        })
        cy.get('.bag__quantity').should(($bagCart) => {
            const text = $bagCart.text()
            expect(text).to.eql('1');
        })

        var subTotal;
        cy.get('.sub-price__val').should(($subTotal) => {
            const text = $subTotal.text()
            subTotal = '$ ' + dollar + '' + cents;
            expect(subTotal).to.eql(text);
        });
        shoppingPage.checkoutCart();
        cy.on('window:confirm', (str) => {
            expect(str).to.eq(`Checkout - Subtotal: ${subTotal}`);
            return true;
        })
        shoppingPage.closeCart();
    });

    it('Remove the product from cart and now it should show zero products in cart', async () => {

        cy.get('@items').then((items) => {
            shoppingPage.selectItem(items.tshirt);
        })

        cy.get('.bag__quantity').should(($bagCart) => {
            const text = $bagCart.text()
            expect(text).to.eql('1');
        })
        shoppingPage.deleteItemFromCart();

        cy.get('.bag__quantity').should(($bagCart) => {
            const text = $bagCart.text()
            expect(text).to.eql('0');
        })
        shoppingPage.closeCart();
    });

    it('Sorting with Lowest to Highest Price', () => {

        cy.get('select').select('lowestprice');

        cy.get('@items').then((items) => {
            cy.get('.shelf-container').find('p').contains(items.lowPriceTshirt).parent().find('.val').find('b').should(($dollarCost) => {
                dollar = $dollarCost.text();
            });
        });

        cy.get('@items').then((items) => {
            cy.get('.shelf-container').find('p').contains(items.lowPriceTshirt).parent().find('.val').find('span').should(($centCost) => {
                cents = $centCost.text();
                expect('$' + dollar + '' + cents).to.eql(items.lowestPrice);
            });
        });

    })

    it('Sorting with Highest to Lowest Price', () => {

        cy.get('select').select('highestprice');
        cy.get('@items').then((items) => {
            cy.get('.shelf-container').find('p').contains(items.highPriceTshirt).parent().find('.val').find('b').should(($dollarCost) => {
                dollar = $dollarCost.text();
            });
        });

        cy.get('@items').then((items) => {
            cy.get('.shelf-container').find('p').contains(items.highPriceTshirt).parent().find('.val').find('span').should(($centCost) => {
                cents = $centCost.text();
                expect('$' + dollar + '' + cents).to.eql(items.highestPrise);
            });
        });
    })

});