'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { listProducts } from "@/app/actions";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    const fetchData = async () => {
        try {
          const response = await listProducts();
          setProducts(response);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    };
    // Call fetchData when the component mounts
    fetchData();
  }, []);

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => 
      (category === "all" || product.category === category) &&
      product.price >= priceRange[0] &&
      product.price <= priceRange[1]
    )
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0; // featured
    });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters and Sort */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Electronics">Electronics</SelectItem>
            <SelectItem value="Accessories">Accessories</SelectItem>
          </SelectContent>
        </Select>

        <div className="space-y-2">
          <label className="text-sm font-medium">Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
          <Slider
            defaultValue={[0, 300]}
            max={300}
            step={10}
            value={priceRange}
            onValueChange={setPriceRange}
          />
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <Card className="overflow-hidden transition-transform hover:scale-[1.02]">
              <div className="relative h-64">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="mb-1 text-lg font-semibold">{product.name}</h3>
                <p className="mb-3 text-sm text-muted-foreground">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold">${product.price}</span>
                  <Button size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center text-muted-foreground">
          No products found matching your criteria.
        </div>
      )}
    </div>
  );
}