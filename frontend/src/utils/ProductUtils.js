export const sortProducts = (products, sortOption) => {
    const sorted = [...products];
    switch(sortOption) {
      case 'low-high':
        return sorted.sort((a, b) => 
          (a.offerprice || a.baseprice || Infinity) - (b.offerprice || b.baseprice || Infinity)
        );
      case 'high-low':
        return sorted.sort((a, b) => 
          (b.offerprice || b.baseprice || -Infinity) - (a.offerprice || a.baseprice || -Infinity)
        );
      case 'relevant':
      default:
        return sorted.sort((a, b) => {
          //Items with higher discounts first
          const discountDiff = (b.offerPercentage || 0) - (a.offerPercentage || 0);
          if (discountDiff !== 0) return discountDiff;
          
          
          
          // Newest items first (if you have createdAt dates)
          if (b.createdAt && a.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          
          return 0;
        });
    }
  };