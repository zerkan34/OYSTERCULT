<?php

namespace App\Form;

use App\Entity\Inventory\Product;
use App\Entity\Inventory\StorageLocation;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\MoneyType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProductType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', TextType::class, [
                'label' => 'Nom du produit',
                'attr' => [
                    'placeholder' => 'Entrez le nom du produit',
                    'class' => 'form-control'
                ]
            ])
            ->add('description', TextareaType::class, [
                'label' => 'Description',
                'required' => false,
                'attr' => [
                    'placeholder' => 'Entrez une description du produit',
                    'class' => 'form-control',
                    'rows' => 3
                ]
            ])
            ->add('price', MoneyType::class, [
                'label' => 'Prix',
                'currency' => 'EUR',
                'attr' => [
                    'class' => 'form-control'
                ]
            ])
            ->add('quantity', IntegerType::class, [
                'label' => 'Quantité en stock',
                'attr' => [
                    'class' => 'form-control',
                    'min' => 0
                ]
            ])
            ->add('minQuantity', IntegerType::class, [
                'label' => 'Quantité minimale',
                'attr' => [
                    'class' => 'form-control',
                    'min' => 0
                ]
            ])
            ->add('unit', TextType::class, [
                'label' => 'Unité',
                'attr' => [
                    'class' => 'form-control'
                ]
            ])
            ->add('status', ChoiceType::class, [
                'label' => 'Statut',
                'choices' => [
                    'Disponible' => 'available',
                    'Rupture de stock' => 'out_of_stock',
                    'Discontinué' => 'discontinued'
                ],
                'attr' => [
                    'class' => 'form-control'
                ]
            ])
            ->add('storageLocation', EntityType::class, [
                'label' => 'Emplacement de stockage',
                'class' => StorageLocation::class,
                'choice_label' => 'name',
                'required' => false,
                'placeholder' => 'Sélectionnez un emplacement',
                'attr' => [
                    'class' => 'form-control'
                ]
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Product::class,
        ]);
    }
}
