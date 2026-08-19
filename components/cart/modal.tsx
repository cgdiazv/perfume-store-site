'use client';

import { Dialog, Transition } from '@headlessui/react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import Price from 'components/price';
import type { VercelCart as Cart } from 'lib/bigcommerce/types';
import { DEFAULT_OPTION } from 'lib/constants';
import { createUrl } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useRef, useState } from 'react';
import CloseCart from './close-cart';
import { DeleteItemButton } from './delete-item-button';
import { EditItemQuantityButton } from './edit-item-quantity-button';
import OpenCart from './open-cart';

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal({
  cart,
  isLoggedIn
}: {
  cart: Cart | undefined;
  isLoggedIn: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    // Open cart modal when quantity changes.
    if (cart?.totalQuantity !== quantityRef.current) {
      // But only if it's not already open (quantity also changes when editing items in cart).
      if (!isOpen) {
        setIsOpen(true);
      }

      // Always update the quantity reference
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef]);

  const MIN_PURCHASE_AMOUNT = 100;
  const subtotal = cart?.cost?.subtotalAmount?.amount
    ? parseFloat(cart.cost.subtotalAmount.amount)
    : cart?.cost?.totalAmount?.amount
    ? parseFloat(cart.cost.totalAmount.amount)
    : 0;

  const percentage = Math.min(100, Math.max(0, (subtotal / MIN_PURCHASE_AMOUNT) * 100));
  const remaining = Math.max(0, MIN_PURCHASE_AMOUNT - subtotal);
  const isUnlocked = subtotal >= MIN_PURCHASE_AMOUNT;

  return (
    <>
      <button aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={cart?.totalQuantity} />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="bg-black/30 fixed inset-0" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white p-6 text-black backdrop-blur-xl md:w-[390px] dark:border-neutral-800 dark:bg-[#181412] dark:text-white">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">My Cart</p>

                <button aria-label="Close cart" onClick={closeCart}>
                  <CloseCart />
                </button>
              </div>

              {/* Progress Bar for Minimum Purchase Amount ($100) */}
              <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-3.5 dark:border-neutral-800 dark:bg-[#12100e]">
                <div className="flex items-center justify-between text-xs font-semibold">
                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <span>🎉</span> Minimum purchase of ${MIN_PURCHASE_AMOUNT} reached!
                    </span>
                  ) : (
                    <span className="text-gray-700 dark:text-neutral-300">
                      Add <span className="font-bold text-[#b42e31]">${remaining.toFixed(2)}</span> more to reach ${MIN_PURCHASE_AMOUNT} minimum
                    </span>
                  )}
                  <span className="font-semibold text-neutral-500 dark:text-neutral-400">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
                <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${
                      isUnlocked ? 'bg-emerald-500' : 'bg-[#b42e31]'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {!cart || cart.lines.length === 0 ? (
                <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
                  <ShoppingCartIcon className="h-16" />
                  <p className="mt-6 text-center text-2xl font-bold">Your cart is empty.</p>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between overflow-hidden p-1">
                  <ul className="flex-grow overflow-auto py-4">
                    {cart.lines.map((item, i) => {
                      const merchandiseSearchParams = {} as MerchandiseSearchParams;
                      let subTitleWithSelectedOptions = '';

                      item.merchandise.selectedOptions.forEach(({ name, value }) => {
                        subTitleWithSelectedOptions += `${name}: ${value} `;
                        if (value !== DEFAULT_OPTION) {
                          merchandiseSearchParams[name.toLowerCase()] = value;
                        }
                      });

                      const merchandiseUrl = createUrl(
                        item.merchandise.product.handle,
                        new URLSearchParams(merchandiseSearchParams)
                      );

                      return (
                        <li
                          key={i}
                          className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700"
                        >
                          <div className="relative flex w-full flex-row justify-between px-1 py-4">
                            <div className="absolute z-40 -mt-2 ml-[55px]">
                              <DeleteItemButton item={item} />
                            </div>
                            <Link
                              href={merchandiseUrl}
                              onClick={closeCart}
                              className="z-30 flex flex-row space-x-4"
                            >
                              <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                                <Image
                                  className="h-full w-full object-cover"
                                  width={64}
                                  height={64}
                                  alt={
                                    item.merchandise.product.featuredImage.altText ||
                                    item.merchandise.product.title
                                  }
                                  src={item.merchandise.product.featuredImage.url}
                                />
                              </div>

                              <div className="flex flex-1 flex-col text-base">
                                <span className="leading-tight">
                                  {item.merchandise.product.title}
                                </span>
                                {item.merchandise.title !== DEFAULT_OPTION ? (
                                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{item.merchandise.title}</p>
                                ) : null}
                              </div>
                            </Link>
                            <div className="flex h-16 flex-col justify-between">
                              {isLoggedIn ? (
                                <Price
                                  className="flex justify-end space-y-2 text-right text-sm"
                                  amount={item.cost.totalAmount.amount}
                                  currencyCode={item.cost.totalAmount.currencyCode}
                                />
                              ) : (
                                <Link href="/login" className="text-right text-sm hover:underline">
                                  Sign in to view
                                </Link>
                              )}
                              <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                                <EditItemQuantityButton item={item} type="minus" />
                                <p className="w-6 text-center">
                                  <span className="w-full text-sm">{item.quantity}</span>
                                </p>
                                <EditItemQuantityButton item={item} type="plus" />
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="py-4 text-sm text-neutral-500 dark:text-neutral-300">
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700">
                      <p className="text-sm text-neutral-600 dark:text-neutral-300">Taxes</p>
                      {isLoggedIn ? (
                        <Price
                          className="text-right text-base text-black dark:text-white"
                          amount={cart.cost.totalTaxAmount.amount}
                          currencyCode={cart.cost.totalTaxAmount.currencyCode || 'USD'}
                        />
                      ) : (
                        <Link href="/login" className="text-right text-sm hover:underline">
                          Sign in to view
                        </Link>
                      )}
                    </div>
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                      <p className="text-sm text-neutral-600 dark:text-neutral-300">Shipping</p>
                      <p className="text-right text-sm text-neutral-600 dark:text-neutral-300">Calculated at checkout</p>
                    </div>
                    <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
                      <p className="text-sm text-neutral-600 dark:text-neutral-300">Total</p>
                      {isLoggedIn ? (
                        <Price
                          className="text-right text-base text-black dark:text-white"
                          amount={cart.cost.totalAmount.amount}
                          currencyCode={cart.cost.totalAmount.currencyCode || 'USD'}
                        />
                      ) : (
                        <Link href="/login" className="text-right text-sm hover:underline">
                          Sign in to view
                        </Link>
                      )}
                    </div>
                  </div>

                  {!isUnlocked ? (
                    <>
                      <p className="mb-2 text-center text-xs font-medium text-[#b42e31] dark:text-red-400">
                        Minimum order amount is ${MIN_PURCHASE_AMOUNT}. Add ${remaining.toFixed(2)} more to unlock checkout.
                      </p>
                      <button
                        type="button"
                        disabled
                        aria-disabled="true"
                        className="block w-full cursor-not-allowed rounded-full bg-neutral-200 p-3 text-center text-sm font-bold uppercase tracking-wider text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500"
                      >
                        Proceed to Checkout
                      </button>
                    </>
                  ) : (
                    <Link
                      href={`/checkout?id=${cart.id}`}
                      onClick={closeCart}
                      className="block w-full rounded-full bg-[#b42e31] p-3 text-center text-sm font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[#8f2226] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b42e31]"
                    >
                      Proceed to Checkout
                    </Link>
                  )}
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
