import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useVideoConfig,
} from 'remotion';
import {AUTHOR_FPS, T, useAuthoredFrame} from '../timeline';
import {Building2, Package, ShoppingCart, Star, Truck} from 'lucide-react';
import {SceneBackground} from '../components/SceneBackground';
import {Eyebrow} from '../components/Eyebrow';
import {AnimatedText} from '../components/AnimatedText';
import {Pill} from '../components/Pill';
import {colors, radius, shadows} from '../theme';
import {fontBody, fontDisplay} from '../fonts';
import {useCopy} from '../i18n/LocaleContext';

/**
 * Cena 9 — Compra integrada: ingrediente em falta "sai" da
 * receita e voa para o carrinho; card de fornecedor/preço aparece.
 */

const FLY_START = 70;
const FLY_END = 115;
const SUPPLIER_IN = 145;

/** Origem aproximada da linha "Pistache puro" no card da receita. */
const RECIPE_POS = {x: 420, y: 520};
/** Destino do chip (centro do carrinho). */
const CART_POS = {x: 1480, y: 360};

/** Index of the out-of-stock ingredient (Pistache puro). */
const OUT_OF_STOCK_INDEX = 1;

export const Scene09: React.FC = () => {
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;
  const c = useCopy();

  const ingredients = c.scene09.ingredients.map((ing, i) => ({
    ...ing,
    inStock: i !== OUT_OF_STOCK_INDEX,
  }));

  const recipeIn = spring({frame: frame - 10, fps, config: {damping: 200, stiffness: 90}});
  const cartIn = spring({frame: frame - 40, fps, config: {damping: 13, stiffness: 120, mass: 0.8}});

  const flight = interpolate(frame, [FLY_START, FLY_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const eased = 1 - Math.pow(1 - flight, 2.4);
  const chipX = RECIPE_POS.x + 120 + (CART_POS.x - RECIPE_POS.x - 160) * eased;
  const chipY =
    RECIPE_POS.y - 90 +
    (CART_POS.y - RECIPE_POS.y + 40) * eased -
    Math.sin(eased * Math.PI) * 220;
  const chipVisible = frame >= FLY_START && frame <= FLY_END + 4;

  const cartBounce = spring({
    frame: frame - FLY_END,
    fps,
    config: {damping: 8, stiffness: 200, mass: 0.6},
  });
  const cartScale = frame >= FLY_END ? 1 + Math.sin(cartBounce * Math.PI) * 0.12 : 1;

  const badgePop = spring({
    frame: frame - FLY_END - 4,
    fps,
    config: {damping: 9, stiffness: 240, mass: 0.5},
  });

  const supplierIn = spring({
    frame: frame - SUPPLIER_IN,
    fps,
    config: {damping: 200, stiffness: 95},
  });

  return (
    <SceneBackground>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 40, gap: 14, zIndex: 5}}>
        <Eyebrow delay={2} fontSize={38}>
          {c.scene09.eyebrow}
        </Eyebrow>
        <AnimatedText
          text={c.scene09.subtitle}
          delay={12}
          stagger={2}
          style={{
            fontFamily: fontBody,
            fontWeight: 500,
            fontSize: 34,
            color: colors.textMuted,
            maxWidth: 1600,
            textAlign: 'center',
          }}
        />
      </AbsoluteFill>

      {/* Card da receita */}
      <div
        style={{
          position: 'absolute',
          left: 90,
          top: 210,
          width: 700,
          opacity: recipeIn,
          transform: `translateY(${(1 - recipeIn) * 50}px)`,
          borderRadius: radius.shell,
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.shell,
          padding: '36px 40px',
        }}
      >
        <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}>
          <span
            style={{
              fontFamily: fontBody,
              fontWeight: 700,
              fontSize: 36,
              color: colors.textPrimary,
            }}
          >
            {c.scene09.recipeTitle}
          </span>
          <span
            style={{
              fontFamily: fontBody,
              fontWeight: 600,
              fontSize: 18,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: colors.textMuted,
            }}
          >
            {c.scene09.recipeBadge}
          </span>
        </div>
        <div style={{marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14}}>
          {ingredients.map((ing, i) => {
            const rowIn = interpolate(frame - 30 - i * 8, [0, 10], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const isMissing = !ing.inStock;
            const flyOut = isMissing
              ? interpolate(frame, [FLY_START - 8, FLY_START + 4], [1, 0.35], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                })
              : 1;
            return (
              <div
                key={ing.name}
                style={{
                  opacity: rowIn * flyOut,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '18px 24px',
                  borderRadius: radius.md,
                  backgroundColor: isMissing ? colors.dangerSoft : colors.surfaceMuted,
                  border: `1.5px solid ${isMissing ? colors.danger : colors.borderSoft}`,
                  fontFamily: fontBody,
                  fontSize: 28,
                }}
              >
                <span style={{fontWeight: 600, color: colors.textPrimary}}>{ing.name}</span>
                <span
                  style={{
                    color: isMissing ? colors.danger : colors.textMuted,
                    fontWeight: 700,
                    fontSize: isMissing ? 26 : 28,
                  }}
                >
                  {isMissing ? c.scene09.outOfStock : ing.qty}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chip voador */}
      {chipVisible ? (
        <div
          style={{
            position: 'absolute',
            left: chipX,
            top: chipY,
            transform: `translate(-50%, -50%) rotate(${eased * 14}deg)`,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            backgroundColor: colors.surface,
            border: `2.5px solid ${colors.primary}`,
            borderRadius: 32,
            boxShadow: shadows.shell,
            padding: '16px 30px',
            fontFamily: fontBody,
            fontWeight: 700,
            fontSize: 32,
            color: colors.textPrimary,
            zIndex: 10,
          }}
        >
          <Package size={30} color={colors.primary} />
          {c.scene09.flyingChip}
        </div>
      ) : null}

      {/* Carrinho */}
      <div
        style={{
          position: 'absolute',
          left: CART_POS.x - 130,
          top: CART_POS.y - 130,
          opacity: cartIn,
          transform: `scale(${cartIn * cartScale})`,
          zIndex: 6,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 260,
            height: 260,
            borderRadius: '50%',
            backgroundColor: colors.primarySoft,
            border: `2.5px solid ${colors.border}`,
            boxShadow: shadows.shell,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ShoppingCart size={112} color={colors.primary} strokeWidth={1.7} />
          <div
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              transform: `scale(${badgePop})`,
              width: 68,
              height: 68,
              borderRadius: '50%',
              backgroundColor: colors.danger,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: fontBody,
              fontWeight: 700,
              fontSize: 32,
              color: colors.textInverse,
              boxShadow: shadows.md,
            }}
          >
            1
          </div>
        </div>
      </div>

      {/* Card do fornecedor */}
      <div
        style={{
          position: 'absolute',
          left: 1040,
          top: 560,
          width: 780,
          opacity: supplierIn,
          transform: `translateY(${(1 - supplierIn) * 44}px)`,
          borderRadius: radius.shell,
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.shell,
          padding: '32px 36px',
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: radius.md,
              backgroundColor: colors.primarySoft,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Building2 size={40} color={colors.primary} strokeWidth={1.9} />
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0}}>
            <span
              style={{
                fontFamily: fontBody,
                fontWeight: 700,
                fontSize: 32,
                color: colors.textPrimary,
              }}
            >
              {c.scene09.supplierName}
            </span>
            <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
              <Pill bg={colors.warningSoft} color="#92400E" fontSize={20}>
                <Star size={20} color="#92400E" fill="#F59E0B" />
                {c.scene09.supplierPrimary}
              </Pill>
              <Pill bg={colors.successSoft} color={colors.success} fontSize={20}>
                <Truck size={20} color={colors.success} />
                {c.scene09.delivery}
              </Pill>
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: `1px solid ${colors.borderSoft}`,
            paddingTop: 22,
            gap: 20,
          }}
        >
          <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
            <span
              style={{
                fontFamily: fontBody,
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: colors.textMuted,
              }}
            >
              {c.scene09.productLine}
            </span>
            <span
              style={{
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: 56,
                color: colors.textPrimary,
                whiteSpace: 'nowrap',
                lineHeight: 1,
              }}
            >
              {c.scene09.price}
            </span>
          </div>
          <div
            style={{
              backgroundColor: colors.primary,
              color: colors.textInverse,
              fontFamily: fontBody,
              fontWeight: 600,
              fontSize: 26,
              padding: '20px 32px',
              borderRadius: radius.md,
              boxShadow: shadows.md,
              whiteSpace: 'nowrap',
            }}
          >
            {c.scene09.buyCta}
          </div>
        </div>
      </div>
    </SceneBackground>
  );
};
